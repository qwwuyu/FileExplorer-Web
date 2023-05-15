import { useTitle } from '@src/hooks/useTitle';
import { useMemo, useRef, useState } from 'react';
import { BASE_HOST, simpleRequest } from '@src/api';
import './File.less';
import { Breadcrumb, Popconfirm, UploadProps } from 'antd';
import { message } from 'antd';
import AntdUpload from '@src/components/AntdUpload/AntdUpload';
import { FolderFilled, FileOutlined, CloseOutlined, RetweetOutlined } from '@ant-design/icons';
import { LineView } from '@src/components/LineView/LineView';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGlobalComponents } from '@src/PageWrapper';
import { noop } from '@src/utils/CommUtil';

type PathLink = {
  title: string;
  pathname: string;
  search: string;
  link: boolean;
};

type FileBean = {
  name: string;
  dir: boolean;
  apk: boolean;
  date?: string;
  info?: string;
};

type FileData = FileBean & {
  pathname: string;
  parent: string;
  filepath: string;
  fileQuery: string;
};

export default function File() {
  useTitle('文件管理器');
  const components = useGlobalComponents();
  const location = useLocation();
  const navigate = useNavigate();
  const [pathLinks, pathname, dirpath] = useMemo(() => {
    const search = new URLSearchParams(location.search);
    const pathname = location.pathname;
    let dirpath = search.get('path') || '';
    if (dirpath.length > 0 && !dirpath.startsWith('/')) {
      dirpath = '/' + dirpath;
    }

    // const search = qs.stringify({ query: 'value' }, { format: 'RFC1738' });
    // unescape(search);
    const pathLinks: PathLink[] = [];
    search.delete('path');
    pathLinks.push({
      title: '全部文件',
      pathname: pathname,
      search: decodeURIComponent(search.toString()),
      link: true,
    });
    const pathArr = dirpath.split('/').filter((s) => s != '');
    let newPath = '';
    for (let i = 0; i < pathArr.length; i++) {
      newPath = newPath + '/' + pathArr[i];
      search.set('path', newPath);
      pathLinks.push({
        title: pathArr[i],
        pathname: pathname,
        search: decodeURIComponent(search.toString()),
        link: true,
      });
    }
    pathLinks[pathLinks.length - 1].link = false;
    return [pathLinks, pathname, dirpath];
  }, [location]);

  const [fileArr, setFileArr] = useState<FileData[]>([]);
  const [showDelDir, setShowDelDir] = useState(false);
  const currentQueryPath = useRef('');

  function query(queryPath: string) {
    currentQueryPath.current = queryPath;
    const params = queryPath == '' ? {} : { path: queryPath };
    simpleRequest<FileBean[]>('query', params)
      .then((fbArr) => {
        if (currentQueryPath.current != queryPath) return;
        const fdArr: FileData[] = fbArr.map((fb) => ({
          ...fb,
          pathname: pathname,
          parent: queryPath,
          filepath: `${queryPath}/${fb.name}`,
          fileQuery: `path=${queryPath}/${fb.name}`,
        }));
        setFileArr(fdArr);
        setShowDelDir(fdArr.length == 0);
      })
      .catch((err) => {
        if (currentQueryPath.current != queryPath) return;
        message.error(`${err.msg ? err.msg : '获取数据失败!'}`);
        setFileArr([]);
      });
  }
  useMemo(() => {
    setShowDelDir(false);
    query(dirpath);
  }, [dirpath]);

  const clickDel = async (f: FileData) => {
    simpleRequest('del', { path: f.filepath })
      .then(() => {
        message.info('删除成功');
        query(dirpath);
      })
      .catch((err) => {
        message.error(`${err.msg ? err.msg : '删除失败!'}`);
      });
  };
  const clickApk = (f: FileData) => {
    simpleRequest('apk', { path: f.filepath })
      .then(() => {
        message.info('安装请求已经发送,请在手机端处理.');
      })
      .catch((err) => {
        message.error(`${err.msg ? err.msg : '请求失败!'}`);
      });
  };
  const refresh = async () => query(dirpath);
  const createDir = async () => {
    let word = '';
    try {
      word = await components.input('请输入文件夹名称', '');
      word = word.replace(/(\r\n|\n|\r)/gm, '');
    } catch (error) {
      return;
    }
    if (word && '' != word) {
      simpleRequest('createDir', { path: dirpath, dirName: word })
        .then(() => {
          message.info('创建成功');
          query(dirpath);
        })
        .catch((err) => {
          message.error(`${err.msg ? err.msg : '请求失败!'}`);
        });
    }
  };
  const delDir = async () => {
    try {
      await components.confirm('温馨提示', '确定要删除目录:' + dirpath + '?');
    } catch (error) {
      return;
    }
    const link = pathLinks[pathLinks.length - 2];
    simpleRequest('delDir', { path: dirpath })
      .then(() => {
        message.info('删除成功');
        navigate({ pathname: link.pathname, search: link.search });
      })
      .catch((err) => {
        message.error(`${err.msg ? err.msg : '请求失败!'}`);
      });
  };
  //文件夹
  const FolderView = (f: FileData) => {
    return (
      <>
        <Link className='folder-title' to={`${f.pathname}?${f.fileQuery}`}>
          <FolderFilled className='file-icon' />
          <span className='file-text'>{f.name}</span>
        </Link>
        {(f.date != null || f.info != null) && (
          <div className='file-ctrl'>
            {f.date != null && <span className='file-date'>{f.date}</span>}
            {f.info != null && <span className='file-info'>{f.info}</span>}
          </div>
        )}
      </>
    );
  };
  //普通文件
  const FileView = (f: FileData) => {
    return (
      <>
        <div className='file-title'>
          <FileOutlined className='file-icon' />
          <span className='file-text'>{f.name}</span>
        </div>
        <div className='file-ctrl'>
          <a className='file-open' target='_blank' href={`${BASE_HOST}/i/open?${f.fileQuery}`}>
            打开
          </a>
          <a className='file-download' href={`${BASE_HOST}/i/download?${f.fileQuery}`}>
            下载
          </a>
          <Popconfirm
            title='温馨提示'
            description='确定要删除该文件?'
            onConfirm={() => clickDel(f)}
            placement='right'
            okText='删除'
            cancelText='取消'
          >
            <div className='file-delete'>删除</div>
          </Popconfirm>
          {f.apk && (
            <div className='file-apk' onClick={() => clickApk(f)}>
              安装
            </div>
          )}
          {f.date != null && <span className='file-date'>{f.date}</span>}
          {f.info != null && <span className='file-info'>{f.info}</span>}
        </div>
      </>
    );
  };

  //上传UI
  const uploadRef = useRef<unknown>(null);
  const [uploadShow, setUploadShow] = useState(false);
  const [uploadListShow, setUploadListShow] = useState(false);
  const [uploadDone, setUploadDone] = useState(0);
  const [uploadIng, setUploadIng] = useState(0);
  const [uploadError, setUploadError] = useState(0);
  const props: UploadProps = {
    action: `/i/upload?path=${dirpath}`,
    multiple: true,
    children: <span className='func-ctrl'>上传文件</span>,
    iconRender: () => <FileOutlined />,
    beforeUpload() {
      setUploadShow(true);
      setUploadListShow(true);
      return true;
    },
    onChange(info) {
      setUploadDone(info.fileList.filter((f) => f.status == 'done').length);
      setUploadIng(info.fileList.filter((f) => f.status == 'uploading').length);
      setUploadError(info.fileList.filter((f) => f.status == 'error').length);
      if (info.file.status === 'done') {
        query(dirpath);
      }
      if (info.fileList.length == 0) {
        setUploadShow(false);
      }
    },
  };
  const UploadList = () => (
    <div className='layout-upload-list'>
      <div className='upload-title' onClick={() => setUploadListShow(!uploadListShow)}>
        <div className='upload-state' onClick={noop}>
          <span className='upload-state-text text-suc'>上传中：{uploadIng}</span>
          <span className='upload-state-text text-nor'>完成：{uploadDone}</span>
          <span className='upload-state-text text-err'>失败：{uploadError}</span>
        </div>
        <RetweetOutlined className='upload-icon' onClick={() => setUploadListShow(!uploadListShow)} />
        <CloseOutlined className='upload-icon' onClick={() => setUploadShow(false)} />
      </div>
      {uploadListShow && <LineView />}
      {uploadListShow && <div className='upload-list'>{exportUploadList()}</div>}
    </div>
  );
  const { exportUpload, exportUploadList, UploadAble } = AntdUpload(props, uploadRef);

  return (
    <div className='layout-file'>
      <div className='layout-func'>
        <div className='layout-file-dragger'>{exportUpload()}</div>
        <span className='func-ctrl' onClick={refresh}>
          刷新
        </span>
        <span className='func-ctrl' onClick={createDir}>
          创建文件夹
        </span>
      </div>
      <LineView />
      <div className='layout-breadcrumb'>
        <Breadcrumb>
          {pathLinks.map((p) => (
            <Breadcrumb.Item className='breadcrumb-link' key={p.search}>
              {p.link ? (
                <Link to={{ pathname: p.pathname, search: p.search }} className='breadcrumb-link'>
                  {p.title}
                </Link>
              ) : (
                <span className='breadcrumb-title'>{p.title}</span>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        {showDelDir && (
          <span className='func-ctrl' onClick={delDir} style={{ marginLeft: '12px' }}>
            删除文件夹
          </span>
        )}
      </div>
      <LineView />
      <div className='layout-file-list'>
        {UploadAble(
          <>
            {fileArr.length > 0 && (
              <ul>
                {fileArr.map((f) => (
                  <li key={f.name}>
                    {f.dir && FolderView(f)}
                    {!f.dir && FileView(f)}
                  </li>
                ))}
              </ul>
            )}
          </>,
          'upload-able'
        )}
      </div>
      {uploadShow && UploadList()}
    </div>
  );
}

import { useTitle } from '@src/hooks/useTitle';
import { useMemo, useState } from 'react';
import { simpleRequest } from '@src/api';
import './Note.less';
import { Popconfirm, message } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { LineView } from '@src/components/LineView/LineView';
import { useGlobalComponents } from '@src/PageWrapper';
import { format } from '@src/utils/CommUtil';

type NoteInfo = {
  id: number;
  time: number;
  text: string;
  date?: string;
};

export default function Note() {
  useTitle('记事本');
  const components = useGlobalComponents();
  const [noteArr, setNoteArr] = useState<NoteInfo[]>([]);

  function query() {
    simpleRequest<NoteInfo[]>('note/query')
      .then((arr) => {
        const arr2 = arr.map((note) => {
          note.date = format(new Date(note.time), 'MM-dd hh:mm');
          return note;
        });
        setNoteArr(arr2);
      })
      .catch((err) => {
        message.error(`${err.msg ? err.msg : '获取数据失败!'}`);
      });
  }
  useMemo(() => {
    query();
  }, []);

  const clipboard = (text: string) => {
    // navigator.clipboard
    //   .writeText(text)
    //   .then(() => {
    //     message.success('内容已复制到剪切板');
    //   })
    //   .catch((error) => {
    //     message.error('操作失败:' + error);
    //   });
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    try {
      document.execCommand('copy');
      message.success('内容已复制到剪切板');
    } catch (error) {
      message.error('操作失败:' + error);
    }
    document.body.removeChild(selBox);
  };
  const clickDel = async (note: NoteInfo) => {
    simpleRequest('note/del', { id: note.id })
      .then(() => {
        query();
      })
      .catch((err) => {
        message.error(`${err.msg ? err.msg : '删除失败!'}`);
      });
  };
  const refresh = async () => query();
  const addNote = async () => {
    let text = '';
    try {
      text = await components.input('输入文本内容', '');
    } catch (error) {
      return;
    }
    if (text && '' != text) {
      simpleRequest('note/add', { text: text })
        .then(() => {
          query();
        })
        .catch((err) => {
          message.error(`${err.msg ? err.msg : '请求失败!'}`);
        });
    }
  };
  const edit = async (note: NoteInfo) => {
    let text = '';
    try {
      text = await components.input('编辑文本内容', note.text);
    } catch (error) {
      return;
    }
    if (text && '' != text) {
      simpleRequest('note/edit', { id: note.id, text: text })
        .then(() => {
          query();
        })
        .catch((err) => {
          message.error(`${err.msg ? err.msg : '请求失败!'}`);
        });
    }
  };
  const copy2web = async () => {
    simpleRequest<string>('note/copy2web')
      .then((text) => {
        if (text) {
          clipboard(text);
        } else {
          message.error('复制失败');
        }
      })
      .catch((err) => {
        message.error(`${err.msg ? err.msg : '请求失败!'}`);
      });
  };
  const copy2phone = async (text: string) => {
    simpleRequest<string>('note/copy2phone', { text: text })
      .then(() => {
        message.success('请求成功');
      })
      .catch((err) => {
        message.error(`${err.msg ? err.msg : '请求失败!'}`);
      });
  };
  const clear = async () => {
    try {
      await components.confirm('温馨提示', '确定要清空所有文本?');
    } catch (error) {
      return;
    }
    simpleRequest('note/clear')
      .then(() => {
        query();
      })
      .catch((err) => {
        message.error(`${err.msg ? err.msg : '请求失败!'}`);
      });
  };
  //普通文件
  const NoteView = (note: NoteInfo) => {
    return (
      <>
        <div className='note-title'>
          <FileTextOutlined className='note-icon' />
          <span className='note-text'>{note.text}</span>
        </div>
        <div className='note-ctrl'>
          <div className='note-ctrl-btn' onClick={() => clipboard(note.text)}>
            复制
          </div>
          <div className='note-ctrl-btn2' onClick={() => edit(note)}>
            编辑
          </div>
          <div className='note-ctrl-btn2' onClick={() => copy2phone(note.text)}>
            复制到手机剪切板
          </div>
          <Popconfirm
            title='温馨提示'
            description='确定删除?'
            onConfirm={() => clickDel(note)}
            placement='right'
            okText='删除'
            cancelText='取消'
          >
            <div className='note-ctrl-btn2'>删除</div>
          </Popconfirm>
          <span className='note-date'>{note.date}</span>
        </div>
      </>
    );
  };

  return (
    <div className='layout-note'>
      <div className='layout-func'>
        <span className='func-ctrl' onClick={refresh}>
          刷新
        </span>
        <span className='func-ctrl' onClick={addNote}>
          新增
        </span>
        <span className='func-ctrl' onClick={copy2web}>
          从手机剪切板复制
        </span>
        <span className='func-ctrl' onClick={clear}>
          清空
        </span>
      </div>
      <LineView />
      <div className='layout-content'>
        <div className='layout-scroll'>
          {noteArr.length > 0 && (
            <ul>
              {noteArr.map((note) => (
                <li key={note.id}>{NoteView(note)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

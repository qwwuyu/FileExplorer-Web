import { useEffect, useMemo } from 'react';
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom';
import { RT_FILE, RT_NOTE, RT_SET, RT_SET_GLOBAL, RT_SET_PHONE } from '@src/constants';
import wlog from '@src/utils/WLog';
import { icIcon } from '@src/assets';
import './Header.less';
import classNames from 'classnames';

type HeaderLink = {
  text: string;
  path: string;
  active: boolean;
};

export default function Header() {
  const location = useLocation();

  useEffect(() => {
    wlog.i('location.pathname=' + location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    wlog.i('location.search=' + location.search);
  }, [location.search]);

  const fileMatch = !!useMatch(RT_FILE);
  const noteMatch = !!useMatch(RT_NOTE);
  const setMatch = !!useMatch(RT_SET);
  const globalMatch = !!useMatch(RT_SET + '/' + RT_SET_GLOBAL);
  const phoneMatch = !!useMatch(RT_SET + '/' + RT_SET_PHONE);
  const [links] = useMemo(() => {
    const links: HeaderLink[] = [];
    links.push({ text: '文件管理', path: RT_FILE, active: fileMatch });
    links.push({ text: '记事本', path: RT_NOTE, active: noteMatch });
    links.push({ text: '设置', path: RT_SET + '/' + RT_SET_GLOBAL, active: setMatch || globalMatch || phoneMatch });
    return [links];
  }, [fileMatch, noteMatch, globalMatch, phoneMatch]);

  return (
    <>
      <div className='header-layout'>
        <img className='header-icon' src={icIcon} />
        <ul className='header-ul'>
          {links.map((item, index) => {
            return (
              <li className={classNames('header-li', item.active ? 'active' : '')} key={index}>
                <Link className='header-link' to={item.path}>
                  {item.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='body-layout'>
        <div className='body-space' />
        <div className='body-content'>
          <Outlet />
        </div>
      </div>
    </>
  );
}

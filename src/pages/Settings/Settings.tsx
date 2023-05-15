import { Link, NavLink, Outlet, useMatch } from 'react-router-dom';
import './Settings.less';
import { RT_SET, RT_SET_GLOBAL, RT_SET_PHONE } from '@src/constants';
import { useTitle } from '@src/hooks/useTitle';
import { useMemo } from 'react';
import classNames from 'classnames';

type SetLink = {
  text: string;
  path: string;
  active: boolean;
};

export default function Settings() {
  useTitle('设置');

  const globalMatch = useMatch(RT_SET + '/' + RT_SET_GLOBAL);
  const phoneMatch = useMatch(RT_SET + '/' + RT_SET_PHONE);
  const [links] = useMemo(() => {
    const links: SetLink[] = [];
    links.push({ text: '全局设置', path: RT_SET_GLOBAL, active: !!globalMatch });
    links.push({ text: '手机设置', path: RT_SET_PHONE, active: !!phoneMatch });
    return [links];
  }, [globalMatch, phoneMatch]);

  return (
    <div
      className='set-layout'
      style={{
        height: `calc(100vh - ${48}px)`,
      }}
    >
      <div className='set-nav'>
        <ul className='set-ul'>
          {links.map((item, index) => {
            return (
              <li className={classNames('set-li', item.active ? 'active' : '')} key={index}>
                <Link className='set-link' to={item.path}>
                  {item.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import wlog from './utils/WLog';
import { RT_FILE, RT_NOTE, RT_SET, RT_SET_GLOBAL, RT_SET_PHONE } from './constants';
import Header from './pages/Header/Header';
import File from './pages/File/File';
import Note from './pages/Note/Note';
import Settings from './pages/Settings/Settings';
import Global from './pages/Settings/Global/Global';
import Phone from './pages/Settings/Phone/Phone';
import Empty from './pages/Empty/Empty';
import './app.less';

function App() {
  useEffect(() => {
    wlog.i('App create');
    return function cleanup() {
      wlog.i('App cleanup');
    };
  }, []);

  //<Navigate to="/login" replace />

  // const navigate = useNavigate();
  // navigate('/login');

  //<Outlet />

  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} Component={Header}>
          <Route path={''} element={<Navigate to={RT_FILE} replace />} />
          <Route path={RT_FILE} Component={File} />
          <Route path={RT_NOTE} Component={Note} />
          <Route path={RT_SET} Component={Settings}>
            <Route path={''} element={<Navigate to={RT_SET_GLOBAL} replace />} />
            <Route path={RT_SET_GLOBAL} Component={Global} />
            <Route path={RT_SET_PHONE} Component={Phone} />
          </Route>
        </Route>
        <Route path='*' Component={Empty} />
      </Routes>
    </HashRouter>
  );
}

export default App;

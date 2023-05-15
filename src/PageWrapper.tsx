import React, {
  useRef,
  useState,
  createContext,
  useContext,
  useEffect,
  forwardRef,
  useImperativeHandle,
  Ref,
  useMemo,
} from 'react';
import { ThemeConfig, getThemeConfig } from './appTheme';
import './app.less';
import { Modal } from 'antd';
import { PromiseObj, genPromise } from './utils/CommUtil';

export const PageContext = createContext<PageContextValue>(null as never);

interface UseGlobalComponentsReturn extends GlobalComponentsInterface {
  ready: boolean;
}

export const useGlobalComponents = (): UseGlobalComponentsReturn => {
  const pageContextValue = useContext(PageContext);

  if (pageContextValue) {
    return {
      ...pageContextValue.globalComponents,
      ready: true,
    };
  }

  return {
    ready: false,
  } as any;
};

export interface PageContextValue {
  globalComponents: GlobalComponentsInterface;
  componentReady: boolean;
}

export interface PageWrapperProps {
  children?: React.ReactNode;
  color?: string;
}
export const PageWrapper = forwardRef(({ children, color }: PageWrapperProps, ref: Ref<GlobalComponentsInterface>) => {
  const globalComponentsRef = useRef<GlobalComponentsInterface>(null as any);
  const [componentReady, setComponentReady] = useState<boolean>(false);

  const [{ primaryColor, secondaryColor }] = useState<ThemeConfig>(getThemeConfig());
  const computedStyle: React.CSSProperties = useMemo(
    () =>
      ({
        '--theme-primaryColor': color ? color : primaryColor,
        '--theme-secondaryColor': secondaryColor,
      } as React.CSSProperties),
    [primaryColor, secondaryColor]
  );

  const pageContextValue: PageContextValue = {
    get globalComponents() {
      return globalComponentsRef.current;
    },
    componentReady,
  };

  useImperativeHandle(ref, () => pageContextValue.globalComponents);

  useEffect(() => {
    if (globalComponentsRef.current && !componentReady) {
      setComponentReady(true);
    }
  }, [globalComponentsRef.current]);

  return (
    <PageContext.Provider value={pageContextValue}>
      <div style={computedStyle}>
        {componentReady ? children : null}

        <GlobalComponents ref={globalComponentsRef} />
      </div>
    </PageContext.Provider>
  );
});
PageWrapper.displayName = 'PageWrapper';

export interface GlobalComponentsInterface {
  confirm: (title: string, msg: string) => Promise<any>;
  input: (title: string, text?: string) => Promise<string>;
}

export const GlobalComponents = forwardRef(({}, ref: Ref<GlobalComponentsInterface>) => {
  useImperativeHandle(ref, () => ({
    async confirm(title: string, msg: string): Promise<any> {
      setConfirm({ title: title, msg: msg, show: true });
      confirmRef.current = genPromise<any>();
      return confirmRef.current.promise;
    },
    async input(title: string, text?: string): Promise<any> {
      setInputText(text ? text : '');
      setInput({ title: title, show: true });
      inputRef.current = genPromise<string>();
      return inputRef.current.promise;
    },
  }));

  const confirmRef = useRef<PromiseObj<any>>(genPromise<any>());
  const [confirm, setConfirm] = useState({ title: '', msg: '', show: false });
  const confirmOk = () => {
    setConfirm({ title: '', msg: '', show: false });
    confirmRef.current.resolve();
  };
  const confirmCancel = () => {
    setConfirm({ title: '', msg: '', show: false });
    confirmRef.current.reject();
  };

  const inputRef = useRef<PromiseObj<string>>(genPromise<string>());
  const [input, setInput] = useState({ title: '', show: false });
  const [inputText, setInputText] = useState('');
  const inputOk = () => {
    setInput({ title: '', show: false });
    inputRef.current.resolve(inputText);
  };
  const inputCancel = () => {
    setInput({ title: '', show: false });
    inputRef.current.reject();
  };

  return (
    <>
      {confirm.show && (
        <Modal title={confirm.title} open={true} onOk={confirmOk} onCancel={confirmCancel}>
          <p>{confirm.msg}</p>
        </Modal>
      )}
      {input.show && (
        <Modal title={input.title} open={true} onOk={inputOk} onCancel={inputCancel}>
          <textarea className='gload-input' value={inputText} onChange={(e) => setInputText(e.target.value)} />
        </Modal>
      )}
    </>
  );
});
GlobalComponents.displayName = 'GlobalComponents';

import { useTitle } from '@src/hooks/useTitle';

export default function Empty() {
  useTitle('404');
  return <div>404</div>;
}

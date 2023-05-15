import './LineView.less';
import classNames from 'classnames';

export interface LineViewProps extends StyledProps {
  line?: 'grey' | 'white';
  cut?: 'none' | 'left' | 'all';
}

export function LineView({ line = 'grey', cut = 'none', style }: LineViewProps) {
  return (
    <div
      className={classNames('line-view', `line-view-${cut}`)}
      style={{
        backgroundColor: line == 'grey' ? '#cccccc' : '#FFFFFF',
        ...style,
      }}
    />
  );
}

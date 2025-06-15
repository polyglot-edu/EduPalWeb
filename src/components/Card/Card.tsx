type CardProps = React.HTMLAttributes<HTMLDivElement> & {};

const Card = (props: React.PropsWithChildren<CardProps>) => {
  const { className } = props;

  return <div {...props} className={'Card ' + (className ?? '')} />;
};

export default Card;

type GateProps = {
  type: string;
  onSelect: () => void;
};

function Gate({ type, onSelect }: GateProps) {
  return <div onClick={onSelect}>{type}</div>;
}

export { Gate };

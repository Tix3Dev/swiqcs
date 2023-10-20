type GateProps = {
  type: string;
  onSelect: () => void;
};

function Gate({ type, onSelect }: GateProps) {
  return <div className="gate red" onClick={onSelect}>{type}</div>;
}

export { Gate };

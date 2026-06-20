interface Props {
  name: string;
  count: number;
}

export function ColumnHeader(props: Props) {
  return (
    <header class="column-header">
      <h2>{props.name}</h2>
      <span>{props.count}</span>
    </header>
  );
}

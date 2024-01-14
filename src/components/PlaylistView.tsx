import { Button, ButtonProps, Icon, Table, TableRow } from "semantic-ui-react";
import { Video } from "../types.js";
import { VideoLink } from "./links.js";

interface Props {
  title: string;

  items: Video[];
  currentIndex: number;

  onPlayAt: (idx: number) => void;
}

export const PlaylistView = (props: Props) => {
  const { title, items, currentIndex } = props;

  const handlePlayIndex = (
    event: React.MouseEvent<HTMLButtonElement>,
    input: ButtonProps,
  ) => {
    const id = input["data-id"];
    const idx = items.findIndex((x) => x.id === id);
    props.onPlayAt(idx);
  };

  return (
    <Table compact="very" size="small" selectable unstackable>
      <Table.Header>
        <TableRow>
          <th>
            {title} ({currentIndex + 1}/{items.length})
          </th>
          <th>duration</th>
          <th>action</th>
        </TableRow>
      </Table.Header>
      <Table.Body>
        {items.map((item, idx) => {
          const active = currentIndex === idx;
          return (
            <TableRow key={item.id} positive={active}>
              <td>
                {item.title}
                <br />
                <VideoLink videoId={item.id} />
              </td>
              <td>{item.durationFormatted}</td>
              <td>
                <Button
                  size="mini"
                  icon
                  onClick={handlePlayIndex}
                  data-id={item.id}
                >
                  <Icon name="play" />
                </Button>
              </td>
            </TableRow>
          );
        })}
      </Table.Body>
    </Table>
  );
};

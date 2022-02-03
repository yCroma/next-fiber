import { Button, List, ListItem, Stack, Typography } from '@mui/material';
import clone from 'clone';

type Comment = {
  name: string;
  comment: string;
  clip: Object;
};

const DisplayComments = ({
  comments,
  adaptCommentClip,
}: {
  comments: Array<Comment>;
  adaptCommentClip: Function;
}) => {
  return (
    <>
      {comments.length === 0 ? (
        <Typography mt={1}>コメントはまだ投稿されていません</Typography>
      ) : (
        <List>
          {comments.map((comment) => {
            return CommentList(comment, adaptCommentClip);
          })}
        </List>
      )}
    </>
  );
};
export default DisplayComments;

function CommentList(comment: Comment, setCommentClip: Function) {
  return (
    <>
      <ListItem>
        <Stack direction="row" spacing={2}>
          <Typography>name: {comment.name}</Typography>
          {Object.keys(comment.clip).length === 0 ? (
            <Button disabled variant="outlined" size="small">
              登録されたクリップはありません
            </Button>
          ) : (
            <Button
              color="warning"
              variant="outlined"
              size="small"
              onClick={() => {
                setCommentClip(clone(comment.clip));
              }}
            >
              登録されたクリップを再生
            </Button>
          )}
        </Stack>
      </ListItem>
      <ListItem>
        <Typography>comment: {comment.comment}</Typography>
      </ListItem>
    </>
  );
}

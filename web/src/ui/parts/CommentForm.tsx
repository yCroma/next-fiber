import { useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup,
  Grid,
  Stack,
  ToggleButton,
  Input,
  InputLabel,
} from '@mui/material';

type CommentForm = {
  saveClip: boolean;
  name: string;
  comment: string;
  clip: Object;
};

export default function CommentForm({
  dispatchInputForm,
}: {
  dispatchInputForm: Function;
}) {
  /**
   * TASK:
   * 更新されないプロップスをどうにかして、
   * 投稿時に、名前やコメントを空にする処理
   * を作る
   */
  return (
    <FormGroup>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: -1 }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              onChange={(event: Event) =>
                dispatchInputForm({
                  type: 'saveClip',
                  value: event.target.checked,
                })
              }
            />
          }
          label="現在の設定を保存する"
        />
        <Button
          variant="outlined"
          onClick={() => dispatchInputForm({ type: 'post', value: true })}
        >
          コメントを投稿する
        </Button>
      </Stack>
      <FormControl variant="standard">
        <InputLabel htmlFor="username-clip">name:</InputLabel>
        <Input
          id="username-clip"
          onChange={(event: Event) =>
            dispatchInputForm({ type: 'name', value: event.target.value })
          }
        />
      </FormControl>
      <FormControl variant="standard">
        <InputLabel htmlFor="comment-clip">comment:</InputLabel>
        <Input
          id="comment-clip"
          onChange={(event: Event) =>
            dispatchInputForm({ type: 'comment', value: event.target.value })
          }
          multiline
        />
      </FormControl>
    </FormGroup>
  );
}

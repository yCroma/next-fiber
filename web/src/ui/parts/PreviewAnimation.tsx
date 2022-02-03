import dynamic from 'next/dynamic';

import { Stack, Typography } from '@mui/material';

const CSPlayer = dynamic(() => import('../csr/units/CSPlayer'), {
  loading: () => <p>Loading ...</p>,
  ssr: false,
});

const PreviewAnimation = ({
  comment,
  fbxurl,
  title,
  settings,
  CommentClipRef,
  newCommentClipRef,
}: {
  comment: string;
  fbxurl: string;
  title: string;
  settings?: Object;
  CommentClipRef?: Object;
  newCommentClipRef?: Object;
}) => {
  return (
    <Stack>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body1">{comment}</Typography>
      <CSPlayer
        fbxurl={fbxurl}
        mode={'play'}
        settings={settings}
        CommentClipRef={CommentClipRef}
        newCommentClipRef={newCommentClipRef}
      />
    </Stack>
  );
};

export default PreviewAnimation;

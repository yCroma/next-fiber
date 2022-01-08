import type { GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useReducer, useState } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

const CSPlayer = dynamic(() => import('../ui/csr/units/CSPlayer'), {
  loading: () => <p>Loading ...</p>,
  ssr: false,
});

const Player: NextPage<{ title: string; comment: string; fbxurl: string }> = ({
  title,
  comment,
  fbxurl,
}) => {
  const PresetInit = {
    name: 'hello, fbx',
  };
  const [preset, SetPreset] = useState(PresetInit);

  const initialMode = { mode: 'edit' };
  function modeReducer(state, action) {
    switch (action.type) {
      case 'edit':
        return { mode: 'edit' };
      case 'play':
        return { mode: 'play' };
      case 'upload':
        return { mode: 'upload' };
      default:
        throw new Error();
    }
  }
  const [mode, dispatchMode] = useReducer(modeReducer, initialMode);

  return (
    <Stack sx={{ width: '80%', mx: 'auto' }}>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body1">{comment}</Typography>
      <CSPlayer fbxurl={fbxurl} />
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const title = 'はじめてのチバニー';
  const comment = 'チバニーを作りました';
  const fbxurl = 'test.fbx';
  return {
    props: {
      title,
      comment,
      fbxurl,
    },
  };
};

export default Player;

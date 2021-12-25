import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

const CSPlayer = dynamic(() => import('../ui/csr/units/CSPlayer'), {
  loading: () => <p>Loading ...</p>,
  ssr: false,
});

const Player: NextPage = () => {
  const fbxurl = '/test.fbx';
  const PresetInit = {
    name: 'hello, fbx',
  };
  const [preset, SetPreset] = useState(PresetInit);
  return (
    <Stack sx={{ width: '80%', mx: 'auto' }}>
      <CSPlayer />
    </Stack>
  );
};

export default Player;

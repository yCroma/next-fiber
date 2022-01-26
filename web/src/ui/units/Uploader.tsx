import { Box, Grid, Stack, Typography } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Link as MUILink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DropzoneArea } from 'material-ui-dropzone';

import dynamic from 'next/dynamic';
const CSPlayer = dynamic(() => import('../csr/units/CSPlayer'), {
  loading: () => <p>Loading ...</p>,
  ssr: false,
});

import NewRenderer from "./NewPlayer";
const PostData: {
  title: string;
  comment: string;
  filename: string;
  settings: Object | null;
} = {
  title: '',
  comment: '',
  filename: '',
  settings: null,
};

const Uploader = () => {
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [file, setFile] = useState<File>(null!);
  const [fileurl, setFileURL] = useState<string>(null!);
  const settingsRef = useRef(null);
  const [url, setURL] = useState<URL | undefined>(undefined);
  useEffect(() => {
    if (file) {
      setFileURL(window.URL.createObjectURL(file));
      console.log({ fileurl });
    }
    return () => {
      window.URL.revokeObjectURL(fileurl);
    };
  }, [file]);

  const handleFile = (files: Array<File>) => {
    const file = files[0];
    setFile(file);
  };
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleComment = (event) => {
    setComment(event.target.value);
  };
  return (
    <Stack spacing={2}>
      <Grid item>
        <Typography variant="h2">Upload a FBX file</Typography>
      </Grid>
      <DropzoneArea
        filesLimit={1}
        acceptedFiles={[".fbx"]}
        dropzoneText={"Drag and drop an file(.fbx) or click"}
        onChange={(files) => setFile(files[0])}
      />
      {fileurl && <Typography>URL: {fileurl}</Typography>}
      {fileurl && <NewRenderer url={fileurl} />}
      <Stack spacing={2}>
        <Grid item>
          <Typography variant="h2">Upload a FBX file</Typography>
        </Grid>
      </Stack>
      {!fileurl && (
        <DropzoneArea
          filesLimit={1}
          acceptedFiles={['.fbx']}
          dropzoneText={'Drag and drop an file(.fbx) or click'}
          onChange={handleFile}
          showPreviewsInDropzone={false}
        />
      )}
      {fileurl && (
        <Stack spacing={1} mb={1}>
          {!url && (
            <Box mb={2.5}>
              <Button variant="contained" color="warning" onClick={PostWork}>
                投稿する！
              </Button>
            </Box>
          )}
          <TextField required label="Title" onChange={handleTitle} />
          <TextField
            required
            label="Comment"
            multiline
            onChange={handleComment}
          />
          <CSPlayer fbxurl={fileurl} mode={'edit'} settingsRef={settingsRef} />
        </Stack>
      )}
    </Stack>
  );
};

export default Uploader;

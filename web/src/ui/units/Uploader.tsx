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

import clone from 'clone';
import axios from 'axios';

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
  async function PostWork() {
    /**
     * TASK:
     * - validation
     *  - 0文字で投稿を不可にする
     */
    PostData['title'] = title;
    PostData['comment'] = comment;
    PostData['filename'] = file.name;
    PostData['settings'] = clone(settingsRef.current);
    const path = await axios({
      method: 'POST',
      url: 'http://192.168.1.14:8080/upload/params',
      headers: {
        'Content-Type': 'application/json',
      },
      data: PostData,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Err: ', error);
      });
    const reader = new FileReader();
    const data = new FormData();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const arbf = e.target?.result;
      const newFile = new File([arbf], path);
      data.append('file', newFile);
      axios({
        method: 'POST',
        url: 'http://192.168.1.14:8080/upload/fbx',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      })
        .then((response) => {
          /**
           * TASK:
           * HTTPStatusにあわせた条件分岐
           */
          const baseURL = 'http://192.168.1.14:8080/works';
          const createURL = new URL(`${baseURL}/${path}`);
          setURL(createURL);
        })
        .catch((error) => {
          console.log('err: ', error);
        });
    };
    /**
     * TASK:
     * - 誘導を促すlog
     */
  }
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

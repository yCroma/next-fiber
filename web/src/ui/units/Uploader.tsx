import { Box, Grid, Stack, Typography } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useEffect, useRef, useState } from 'react';

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
    </Stack>
  );
};

export default Uploader;

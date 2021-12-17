import type { NextPage } from "next";
import { Grid, Stack, Typography } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import Uploader from "../ui/units/Uploader";

const Upload: NextPage = () => {
  return (
    <Stack spacing={2}>
      <Uploader />
    </Stack>
  );
};

export default Upload;

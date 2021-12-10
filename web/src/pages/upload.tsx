import type { NextPage } from "next";
import { Grid, Stack, Typography } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";

const Upload: NextPage = () => {
  return (
    <Stack spacing={2}>
      <Grid item>
        <Typography variant="h2">Upload a FBX file</Typography>
      </Grid>
      <DropzoneArea
        filesLimit={1}
        acceptedFiles={[".fbx"]}
        dropzoneText={"Drag and drop an file(.fbx) or click"}
        onChange={(files) => console.log("Files: ", files)}
      />
    </Stack>
  );
};

export default Upload;

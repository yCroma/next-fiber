import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";

const Work: NextPage = () => {
  const router = useRouter();
  console.log(router);
  const { slug } = router.query;
  console.log(router.query);
  return (
    <Stack>
      <Typography>Work: {slug}</Typography>
    </Stack>
  );
};

export default Work;

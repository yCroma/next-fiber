import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Box, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useReducer, useState } from 'react';
import PreviewAnimation from '../../ui/parts/PreviewAnimation';
import DisplayComments from '../../ui/parts/DisplayComments';
import CommentForm from '../../ui/parts/CommentForm';
import axios from 'axios';
import clone from 'clone';

type Asset = {
  title: string;
  comment: string;
  comments: Array<Comment>;
  filename: string;
  settings: Object;
};

type Comment = {
  name: string;
  comment: string;
  clip: Object;
};

const Work: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [url, setURL] = useState<URL | undefined>(undefined);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileurl, setFileURL] = useState<string>('');

  const [commentClip, setCommentClip] = useState({});
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [saveClip, setSaveClip] = useState<boolean>(false);
  const [PostUser, setPostUser] = useState<string>('');
  const [PostComment, setPostComment] = useState<string>('');

  const CommentClipRef = useRef({
    setClip: false,
    commentClip: {},
  });
  const newCommentClipRef = useRef({
    saveClip: false,
    clip: {},
  });

  const initialComment = {
    saveClip: false,
    name: '',
    comment: '',
    clip: {},
    post: false,
  };
  function commentReducer(state, action) {
    switch (action.type) {
      case 'saveClip':
        const isSaveClip: boolean = action.value;
        // 副作用
        newCommentClipRef.current.saveClip = isSaveClip;
        return { ...state, saveClip: isSaveClip };
      case 'name':
        return { ...state, name: action.value };
      case 'comment':
        return { ...state, comment: action.value };
      case 'post':
        if (action.value) {
          /**
           * どこか開発の都合のミスでpostCommentが
           * 3回呼ばれていた。バグなので緊急回避
           */
          action.value = false;
          const clip = state.saveClip ? newCommentClipRef.current.clip : {};
          state.clip = clip;
          postComment(url!, state);
        }
        setOpenForm(false);
        return initialComment;
      default:
        throw new Error();
    }
  }
  const [newComment, dispatchInputForm] = useReducer(
    commentReducer,
    initialComment
  );

  const adaptCommentClip = (clip: Object) => {
    CommentClipRef.current.setClip = false;
    CommentClipRef.current.commentClip = clone(clip);
  };

  const handleSaveClip = () => {
    setSaveClip((value) => !value);
  };
  const handleOpenForm = () => {
    setOpenForm((value) => !value);
  };
  const onDownload = () => {
    const link = document.createElement('a');
    link.download = file!.name;
    link.href = fileurl;
    link.click();
  };

  useEffect(() => {
    if (slug) {
      const baseURL = 'http://192.168.1.14:8080/works';
      const createURL = new URL(`${baseURL}/${slug}`);
      setURL(createURL);
    }
  }, [slug]);
  useEffect(() => {
    if (url) {
      axios({
        method: 'GET',
        url: url.href,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          const newAsset = clone(response.data);
          return setAsset(newAsset);
        })
        .catch((error) => {
          console.error('Err: ', error);
        });
    }
  }, [url]);
  useEffect(() => {
    if (asset) {
      setComments(clone(asset.comments));
      axios({
        method: 'GET',
        url: `${url!.href}/fbx`,
        responseType: 'blob',
      })
        .then((response) => {
          const newBlob = new Blob([response.data]);
          const newFile = new File([newBlob], `${asset.filename}`);
          return setFile(newFile);
        })
        .catch((error) => {
          console.error('Err: ', error);
        });
    }
  }, [asset]);
  useEffect(() => {
    if (file) {
      const createFileURL = URL.createObjectURL(file);
      setFileURL(createFileURL);
    }
    return () => {
      if (fileurl) {
        URL.revokeObjectURL(fileurl);
      }
    };
  }, [file]);

  function postComment(url: URL, state) {
    const { name, comment, clip } = state;
    const newComment = { name, comment, clip };
    axios({
      method: 'POST',
      url: `${url.href}/comment`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: newComment,
    }).then((res) => {
      return setComments(res.data);
    });
  }
  return (
    <Stack alignItems="center">
      <Box sx={{ width: '80%' }}>
        <Stack>
          <Typography>Work: {slug}</Typography>
          {!(asset && fileurl) && <Typography>loading</Typography>}
          {asset && fileurl && (
            <Stack>
              <PreviewAnimation
                title={asset.title}
                comment={asset.comment}
                fbxurl={fileurl}
                settings={asset.settings}
                CommentClipRef={CommentClipRef}
                newCommentClipRef={newCommentClipRef}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 2, ml: 2 }}>
                <Button
                  color="success"
                  variant="outlined"
                  onClick={handleOpenForm}
                >
                  コメントを作成する
                </Button>
                <Button onClick={onDownload} color="info" variant="outlined">
                  作品をダウンロード
                </Button>
              </Stack>
              {openForm && (
                <Box sx={{ width: '80%', mt: 1.5, mb: 1, pl: 2 }}>
                  <CommentForm dispatchInputForm={dispatchInputForm} />
                </Box>
              )}
              <DisplayComments
                comments={comments}
                adaptCommentClip={adaptCommentClip}
              />
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export default Work;

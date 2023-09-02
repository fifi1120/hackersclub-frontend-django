import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { format, parseISO } from 'date-fns';

const PostDetail = ({ post }) => {
  const formattedDate = format(parseISO(post.created_at),  'Ppp');
  return (
    <Card>
      <CardHeader
        title={post.title}
        subheader={`Author: ${post.author}, Created: ${formattedDate}`}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Category: {post.category_display}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body1" color="text.primary">
        </Typography>
        <ReactMarkdown
          children={post.content}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={solarizedlight}
                  language={match[1]}
                  PreTag="div"
                >
                  {children}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        />
      </CardContent>
    </Card>
  );
}

export default PostDetail;

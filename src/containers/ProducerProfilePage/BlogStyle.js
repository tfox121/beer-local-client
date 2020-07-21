import styled from 'styled-components';

const BlogStyle = styled.div`
  .blog-description {
    overflow-y: hidden;
    max-height: 80px;
    -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  }

  .fadeout {
    position: relative;
    bottom: 4em;
    height: 4em;
    background-image: linear-gradient(
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
    );
  }
`;

export default BlogStyle;

import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');

const posts = [
  {
    slug: 'fake-post',
    title: 'Fake Post',
    excerpt: 'Excerpt of fake post',
    updatedAt: 'Nov 3 2021',
  },
];

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText('Fake Post')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-post',
            data: {
              title: [{ type: 'heading', text: 'Fake Post' }],
              content: [{ type: 'paragraph', text: 'Content of fake post' }],
            },
            last_publication_date: '11-03-2021',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'fake-post',
              title: 'Fake Post',
              excerpt: 'Content of fake post',
              updatedAt: '03 de novembro de 2021',
            },
          ],
        },
      }),
    );
  });
});

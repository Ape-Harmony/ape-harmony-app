import { gql, useQuery } from "@apollo/client";

const GET_MINTED_NFTS = gql`
  {
    tokens(where: { mintTime_gt: 0 }) {
      id
      metadataURI
    }
  }
`;

function NFTList() {
  const { loading, error, data } = useQuery(GET_MINTED_NFTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <ul>
      {data.tokens.map(token => (
        <li key={token.id}>
          <img src={token.metadataURI} alt={token.id} />
          <p>{token.id}</p>
        </li>
      ))}
    </ul>
  );
}

export default NFTList;

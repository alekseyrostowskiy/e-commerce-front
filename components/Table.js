import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  th {
    text-transform: uppercase;
    color: #ccc;
    font-weight: 600;
    font-size: 0.7rem;
    text-align: center;
    width: 150px;
  }
  td {
    max-width: 150px;

    text-align: center;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

export default function Table(props) {
  return <StyledTable {...props} />;
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getItemById } from "../services/itemService";
import styled from "styled-components";
import {
  FaArrowLeft,
  FaBox,
  FaTag,
  FaClipboardList,
  FaDollarSign,
  FaTrademark,
} from "react-icons/fa";

const ItemDetailsContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ItemTitle = styled.h2`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const ItemImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ItemInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.p`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #34495e;
`;

const InfoIcon = styled.span`
  margin-right: 0.5rem;
  color: #3498db;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

function ItemDetails() {
  const [item, setItem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getItemById(id).then(setItem).catch(console.error);
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <ItemDetailsContainer>
      <BackLink to="/">
        <FaArrowLeft /> Back to Dashboard
      </BackLink>
      <ItemTitle>{item.name}</ItemTitle>
      {item.image_url && <ItemImage src={item.image_url} alt={item.name} />}
      <ItemInfo>
        <InfoItem>
          <InfoIcon>
            <FaBox />
          </InfoIcon>
          Quantity: {item.quantity}
        </InfoItem>
        <InfoItem>
          <InfoIcon>
            <FaTag />
          </InfoIcon>
          Category: {item.category}
        </InfoItem>
        <InfoItem>
          <InfoIcon>
            <FaClipboardList />
          </InfoIcon>
          Status: {item.status}
        </InfoItem>
        <InfoItem>
          <InfoIcon>
            <FaDollarSign />
          </InfoIcon>
          Price: ${item.price}
        </InfoItem>
        <InfoItem>
          <InfoIcon>
            <FaTrademark />
          </InfoIcon>
          Brand: {item.brand}
        </InfoItem>
      </ItemInfo>
    </ItemDetailsContainer>
  );
}

export default ItemDetails;

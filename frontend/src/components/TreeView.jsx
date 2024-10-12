/* eslint-disable react/prop-types */
import { useState } from "react";
import styled from "styled-components";
import {
  FaChevronRight,
  FaChevronDown,
  FaWarehouse,
  FaBoxOpen,
  FaTrash,
} from "react-icons/fa";

const TreeContainer = styled.ul`
  list-style-type: none;
  padding-left: 20px;
  margin: 0;
  color: white;
`;

const TreeItem = styled.li`
  margin: 5px 0;
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ItemIcon = styled.span`
  margin-right: 5px;
`;

const ItemName = styled.span`
  cursor: pointer;
  margin-left: 5px;
  flex-grow: 1;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 5px;
  visibility: hidden;
  ${ItemContent}:hover & {
    visibility: visible;
  }
  &:hover {
    color: #c0392b;
  }
`;

const TreeView = ({ locations, items, onSelectItem, onAddItem, onDelete }) => {
  const [openLocations, setOpenLocations] = useState({});

  const toggleLocation = (locationId) => {
    setOpenLocations((prev) => ({
      ...prev,
      [locationId]: !prev[locationId],
    }));
  };

  const renderTree = (location) => {
    const subLocations = locations.filter(
      (loc) => loc.parent_id === location._id
    );
    const locationItems = items.filter(
      (item) => item.sub_godown_id === location._id
    );
    const isOpen = openLocations[location._id];

    return (
      <TreeItem key={location._id}>
        <ItemContent
          onClick={() => {
            toggleLocation(location._id);
            onSelectItem(null, location);
          }}
        >
          <ItemIcon>{isOpen ? <FaChevronDown /> : <FaChevronRight />}</ItemIcon>
          <ItemIcon>
            {location.is_godown ? <FaWarehouse /> : <FaBoxOpen />}
          </ItemIcon>
          <ItemName>{location.name}</ItemName>
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(location._id, "location");
            }}
          >
            <FaTrash />
          </DeleteButton>
        </ItemContent>
        {isOpen && (
          <TreeContainer>
            {subLocations.map((subLoc) => renderTree(subLoc))}
            {locationItems.map((item) => (
              <TreeItem key={item._id}>
                <ItemContent onClick={() => onSelectItem(item, location)}>
                  <ItemName>{item.name}</ItemName>
                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item._id, "item");
                    }}
                  >
                    <FaTrash />
                  </DeleteButton>
                </ItemContent>
              </TreeItem>
            ))}
            {!location.is_godown && (
              <TreeItem>
                <ItemContent onClick={() => onAddItem(location._id)}>
                  <ItemName>+ Add Item</ItemName>
                </ItemContent>
              </TreeItem>
            )}
          </TreeContainer>
        )}
      </TreeItem>
    );
  };

  const mainLocations = locations.filter((loc) => !loc.parent_id);

  return (
    <TreeContainer>{mainLocations.map((loc) => renderTree(loc))}</TreeContainer>
  );
};

export default TreeView;

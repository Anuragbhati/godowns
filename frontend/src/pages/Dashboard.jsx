import { useState, useEffect } from "react";
import styled from "styled-components";
import TreeView from "../components/TreeView";
import {
  getLocations,
  createLocation,
  deleteLocation,
} from "../services/locationService";
import { getItems, createItem, deleteItem } from "../services/itemService";
import Header from "../components/Header";
import { FaPlus, FaWarehouse, FaBoxOpen } from "react-icons/fa";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f4f8;
  color: #2d3748;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  width: 100%;
  background-color: #2c3e50;
  color: #ecf0f1;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  max-height: 300px;

  @media (min-width: 768px) {
    width: 300px;
    max-height: none;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ItemDetails = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const DashboardTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
`;

const CreateLocationForm = styled.form`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
    gap: 1rem;
    padding: 2rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #ffffff;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const Button = styled.button`
  background-color: #3498db;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #2980b9;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  font-weight: 600;
`;

const ItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ItemListItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  &:last-child {
    border-bottom: none;
  }
`;

const ItemForm = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const LocationDetails = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const SubLocationList = styled.ul`
  list-style-type: none;
  padding-left: 20px;
`;

const SubLocationItem = styled.li`
  margin: 10px 0;
`;

function Dashboard() {
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLocationName, setNewLocationName] = useState("");
  const [isGodown, setIsGodown] = useState(true);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemStatus, setNewItemStatus] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemBrand, setNewItemBrand] = useState("");
  const [newItemAttributes, setNewItemAttributes] = useState("");
  const [newItemImageUrl, setNewItemImageUrl] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [addItemLocationId, setAddItemLocationId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getLocations(), getItems()])
      .then(([locationsData, itemsData]) => {
        setLocations(locationsData);
        setItems(itemsData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch data. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  const handleCreateLocation = async (e) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;

    const newLocation = {
      name: newLocationName,
      is_godown: isGodown,
    };

    if (selectedParentId) {
      newLocation.parent_id = selectedParentId;
    }

    try {
      const createdLocation = await createLocation(newLocation);
      setLocations([...locations, createdLocation]);

      // If showItemForm is true and it's not a godown, create an item
      if (showItemForm && !isGodown) {
        const newItem = {
          name: newItemName,
          quantity: parseInt(newItemQuantity),
          category: newItemCategory,
          status: newItemStatus || "in_stock",
          sub_godown_id: createdLocation._id,
          price: parseFloat(newItemPrice),
          brand: newItemBrand,
          attributes: newItemAttributes
            ? JSON.parse(newItemAttributes)
            : undefined,
          image_url: newItemImageUrl || undefined,
        };

        const createdItem = await createItem(newItem);
        setItems([...items, createdItem]);
      }

      // Reset form fields
      setNewLocationName("");
      setIsGodown(true);
      setSelectedParentId("");
      resetItemForm();
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to create location or item. Please try again.");
    }
  };

  const handleAddItem = (locationId) => {
    const location = locations.find((loc) => loc._id === locationId);
    if (location && !location.is_godown) {
      setShowAddItemForm(true);
      setAddItemLocationId(locationId);
      setNewItemStatus("in_stock"); // Set default status
    } else {
      setError("Items can only be added to sub-locations.");
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (
      !newItemName.trim() ||
      !newItemQuantity ||
      !newItemCategory ||
      !newItemPrice ||
      !newItemBrand
    )
      return;

    const newItem = {
      name: newItemName,
      quantity: parseInt(newItemQuantity),
      category: newItemCategory,
      status: newItemStatus,
      sub_godown_id: addItemLocationId,
      price: parseFloat(newItemPrice),
      brand: newItemBrand,
      attributes: newItemAttributes ? JSON.parse(newItemAttributes) : undefined,
      image_url: newItemImageUrl || undefined,
    };

    try {
      const createdItem = await createItem(newItem);
      setItems([...items, createdItem]);
      resetItemForm();
      setShowAddItemForm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create item. Please try again.");
    }
  };

  const resetItemForm = () => {
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemCategory("");
    setNewItemStatus("");
    setNewItemPrice("");
    setNewItemBrand("");
    setNewItemAttributes("");
    setNewItemImageUrl("");
    setShowItemForm(false);
  };

  const mainGodowns = locations.filter(
    (loc) => loc.is_godown && !loc.parent_id
  );

  const handleSelectItem = (item, location) => {
    setSelectedItem(item);
    setSelectedLocation(location);
    setShowAddItemForm(false);
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "location") {
        await deleteLocation(id);
        setLocations(locations.filter((loc) => loc._id !== id));
      } else if (type === "item") {
        await deleteItem(id);
        setItems(items.filter((item) => item._id !== id));
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError(`Failed to delete ${type}. Please try again.`);
    }
  };

  const renderSubLocations = (parentId) => {
    const subLocations = locations.filter((loc) => loc.parent_id === parentId);
    if (subLocations.length === 0)
      return <p>No sub-locations in this godown.</p>;

    return (
      <SubLocationList>
        {subLocations.map((subLoc) => (
          <SubLocationItem key={subLoc._id}>
            {subLoc.is_godown ? <FaWarehouse /> : <FaBoxOpen />} {subLoc.name}
          </SubLocationItem>
        ))}
      </SubLocationList>
    );
  };

  const renderItems = (locationId) => {
    const locationItems = items.filter(
      (item) => item.sub_godown_id === locationId
    );
    if (locationItems.length === 0)
      return <p>No items in this sub-location.</p>;

    return (
      <ItemList>
        {locationItems.map((item) => (
          <ItemListItem key={item._id}>{item.name}</ItemListItem>
        ))}
      </ItemList>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DashboardContainer>
      <Header />
      <ContentContainer>
        <Sidebar>
          <TreeView
            locations={locations}
            items={items}
            onSelectItem={handleSelectItem}
            onAddItem={handleAddItem}
            onDelete={handleDelete}
          />
        </Sidebar>
        <MainContent>
          <DashboardTitle>Godown Management</DashboardTitle>
          {showAddItemForm ? (
            <CreateLocationForm onSubmit={handleCreateItem}>
              <FormTitle>Add New Item</FormTitle>
              <Input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name"
                required
              />
              <Input
                type="number"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                placeholder="Quantity"
                required
              />
              <Input
                type="text"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                placeholder="Category"
                required
              />
              <Select
                value={newItemStatus}
                onChange={(e) => setNewItemStatus(e.target.value)}
                required
              >
                <option value="">Select status</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </Select>
              <Input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="Price"
                required
              />
              <Input
                type="text"
                value={newItemBrand}
                onChange={(e) => setNewItemBrand(e.target.value)}
                placeholder="Brand"
                required
              />
              <Input
                type="text"
                value={newItemAttributes}
                onChange={(e) => setNewItemAttributes(e.target.value)}
                placeholder="Attributes (JSON format)"
              />
              <Input
                type="text"
                value={newItemImageUrl}
                onChange={(e) => setNewItemImageUrl(e.target.value)}
                placeholder="Image URL"
              />
              <Button type="submit">
                <FaPlus />
                Add Item
              </Button>
            </CreateLocationForm>
          ) : (
            <CreateLocationForm onSubmit={handleCreateLocation}>
              <FormTitle>Create New Godowns With Locations</FormTitle>
              <Input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder={
                  isGodown ? "Enter new godown name" : "Enter new location name"
                }
                required
              />
              <label>
                <Checkbox
                  type="checkbox"
                  checked={isGodown}
                  onChange={(e) => setIsGodown(e.target.checked)}
                />
                Is Godown
              </label>
              {!isGodown && (
                <Select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  required
                >
                  <option value="">Select parent godown (required)</option>
                  {mainGodowns.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </Select>
              )}
              {!isGodown && (
                <label>
                  <Checkbox
                    type="checkbox"
                    checked={showItemForm}
                    onChange={(e) => setShowItemForm(e.target.checked)}
                  />
                  Add item to this location
                </label>
              )}
              {showItemForm && !isGodown && (
                <ItemForm>
                  <Input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item name"
                    required
                  />
                  <Input
                    type="number"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    placeholder="Quantity"
                    required
                  />
                  <Input
                    type="text"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    placeholder="Category"
                    required
                  />
                  <Select
                    value={newItemStatus}
                    onChange={(e) => setNewItemStatus(e.target.value)}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </Select>
                  <Input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="Price"
                    required
                  />
                  <Input
                    type="text"
                    value={newItemBrand}
                    onChange={(e) => setNewItemBrand(e.target.value)}
                    placeholder="Brand"
                    required
                  />
                  <Input
                    type="text"
                    value={newItemAttributes}
                    onChange={(e) => setNewItemAttributes(e.target.value)}
                    placeholder="Attributes (JSON format)"
                  />
                  <Input
                    type="text"
                    value={newItemImageUrl}
                    onChange={(e) => setNewItemImageUrl(e.target.value)}
                    placeholder="Image URL"
                  />
                </ItemForm>
              )}
              <Button type="submit">
                <FaPlus />
                {isGodown
                  ? "Create Godown"
                  : showItemForm
                  ? "Create Location with Item"
                  : "Create Location"}
              </Button>
            </CreateLocationForm>
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {selectedLocation && !selectedItem && (
            <LocationDetails>
              <h2>{selectedLocation.name}</h2>
              <p>
                Type:{" "}
                {selectedLocation.is_godown ? (
                  <>
                    <FaWarehouse /> Godown
                  </>
                ) : (
                  <>
                    <FaBoxOpen /> Location
                  </>
                )}
              </p>
              {selectedLocation.is_godown ? (
                <>
                  <h3>Locations:</h3>
                  {renderSubLocations(selectedLocation._id)}
                </>
              ) : (
                <>
                  <p>
                    Godown:{" "}
                    {locations.find(
                      (loc) => loc._id === selectedLocation.parent_id
                    )?.name || "N/A"}
                  </p>
                  <h3>Items in this warehouse</h3>
                  {renderItems(selectedLocation._id)}
                </>
              )}
            </LocationDetails>
          )}
          {selectedItem && (
            <ItemDetails>
              <h2>{selectedItem.name}</h2>
              <p>Category: {selectedItem.category}</p>
              <p>Quantity: {selectedItem.quantity}</p>
              <p>Price: ${selectedItem.price}</p>
              <p>Brand: {selectedItem.brand}</p>
              <p>Status: {selectedItem.status}</p>
              {selectedItem.image_url && (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  style={{ maxWidth: "200px", borderRadius: "4px" }}
                />
              )}
              {selectedItem.attributes && (
                <div>
                  <h3>Attributes:</h3>
                  <pre>{JSON.stringify(selectedItem.attributes, null, 2)}</pre>
                </div>
              )}
            </ItemDetails>
          )}
        </MainContent>
      </ContentContainer>
    </DashboardContainer>
  );
}

export default Dashboard;

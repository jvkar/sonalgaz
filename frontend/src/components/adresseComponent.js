import React from 'react';

const Address = ({ address }) => {
  const handleAddressClick = (event) => {
    event.preventDefault();
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <a href="#" onClick={handleAddressClick}>{address}</a>
  );
};

export default Address;

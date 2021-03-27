import React from "react";
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";
import { Descriptions } from "antd";
import AutoComplete from "react-google-autocomplete";

Geocode.setApiKey("AIzaSyCbEYP93AgVjmUf9Eea7Qm9O6uWW3f33-A");

// Map
class App extends React.Component {
  // state
  state = {
    address: "Where is it?",
    city: "",
    area: "",
    state: "",
    zoom: 14,
    height: 400,
    mapPosition: {
      lat: 37.65138565838383,
      lng: 127.01619258483166,
    },
    markerPosition: {
      lat: 37.65138565838383,
      lng: 127.01619258483166,
    },
  };

  // function
  getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };

  getArea = (addressArray) => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };

  getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };

  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();

    // Geocode: lat, lng를 이용해 address, city, area, state를 알기 위함
    Geocode.fromLatLng(newLat, newLng).then((response) => {
      console.log("response", response);

      // information
      const address = response.results[0].formatted_address,
        addressArray = response.results[0].address_components,
        city = this.getCity(addressArray),
        area = this.getArea(addressArray),
        state = this.getState(addressArray);

      //setState
      this.setState({
        address: address ? address : "",
        area: area ? area : "",
        city: city ? city : "",
        state: state ? state : "",
        markerPosition: {
          lat: newLat,
          lng: newLng,
        },
        mapPosition: {
          lat: newLat,
          lng: newLng,
        },
      });
    });
    console.log("newLat", newLat);
  };

  onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      newLat = place.geometry.location.lat(),
      newLng = place.geometry.location.lng();

    //setState
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: newLat,
        lng: newLng,
      },
      mapPosition: {
        lat: newLat,
        lng: newLng,
      },
    });
  };

  // render method
  render() {
    // MapWithAMarker Component
    const MapWithAMarker = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          defaultZoom={this.state.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng,
          }}
        >
          <Marker
            draggable={true}
            onDragEnd={this.onMarkerDragEnd}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng,
            }}
          >
            {/* Add draggable & onDragEnd attribute */}
            <InfoWindow>
              <div>{this.state.address}</div>
            </InfoWindow>
          </Marker>
          <AutoComplete
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: 16,
              marginTop: 2,
              marginBottom: "2rem",
            }}
            types={["(regions)"]}
            onPlaceSelected={this.onPlaceSelected}
          />
        </GoogleMap>
      ))
    );

    // return method
    // Title, Descriptions, MapWithAMarker, Auto-Compelete Serach
    return (
      <div style={{ padding: "1rem", margin: "0 auto", maxWidth: 1000 }}>
        <h1>
          <b>Google Map Basic</b>
        </h1>
        <Descriptions bordered>
          <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
          <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
          <Descriptions.Item label="State">
            {this.state.state}
          </Descriptions.Item>
          <Descriptions.Item label="Adress">
            {this.state.address}
          </Descriptions.Item>
        </Descriptions>

        <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCbEYP93AgVjmUf9Eea7Qm9O6uWW3f33-A&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default App;

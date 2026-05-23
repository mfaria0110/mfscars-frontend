import L from "leaflet"

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
})

export default function MapPicker({
  lat,
  lng,
  setForm
}) {

  function LocationMarker() {

    useMapEvents({

      click(e) {

        const {
          lat,
          lng
        } = e.latlng

        setForm(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }))
      }
    })

    return (
      <Marker
        position={[
          Number(lat) || -22.486181,
          Number(lng) || -44.477584
        ]}
      />
    )
  }

  return (

    <MapContainer

      center={[
        Number(lat) || -22.486181,
        Number(lng) || -44.477584
      ]}

      zoom={13}

      style={{
        height: "250px",
        borderRadius: "12px"
      }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker />

    </MapContainer>
  )
}
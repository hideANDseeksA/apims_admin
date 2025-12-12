import React, { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const AddressForm = ({ onAddressChange }) => {
  const [regions, setRegions] = useState([])
  const [provinces, setProvinces] = useState([])
  const [municipalities, setMunicipalities] = useState([])
  const [barangays, setBarangays] = useState([])

  const [selectedRegion, setSelectedRegion] = useState({ code: "", name: "" })
  const [selectedProvince, setSelectedProvince] = useState({ code: "", name: "" })
  const [selectedMunicipality, setSelectedMunicipality] = useState({ code: "", name: "" })
  const [selectedBarangay, setSelectedBarangay] = useState({ code: "", name: "" })

  const [subdivision, setSubdivision] = useState("")
  const [street, setStreet] = useState("")
  const [houseNo, setHouseNo] = useState("")

  // Fetch data
  useEffect(() => {
    fetch("https://psgc.cloud/api/regions")
      .then(res => res.json())
      .then(setRegions)
  }, [])

  useEffect(() => {
    if (selectedRegion.code)
      fetch(`https://psgc.cloud/api/regions/${selectedRegion.code}/provinces`)
        .then(res => res.json())
        .then(setProvinces)
  }, [selectedRegion.code])

  useEffect(() => {
    if (selectedProvince.code)
      fetch(`https://psgc.cloud/api/provinces/${selectedProvince.code}/cities-municipalities`)
        .then(res => res.json())
        .then(setMunicipalities)
  }, [selectedProvince.code])

  useEffect(() => {
    if (selectedMunicipality.code)
      fetch(`https://psgc.cloud/api/cities-municipalities/${selectedMunicipality.code}/barangays`)
        .then(res => res.json())
        .then(setBarangays)
  }, [selectedMunicipality.code])

  // Send flat data to parent whenever values change
  useEffect(() => {
    onAddressChange?.({
      house_no: houseNo,
      baranggay: selectedBarangay.name,
      street,
      municipality: selectedMunicipality.name,
      subdivision,
      province: selectedProvince.name,
      region: selectedRegion.name
    })
  }, [houseNo, street, subdivision, selectedBarangay, selectedMunicipality, selectedProvince, selectedRegion])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Region</Label>
          <Select
            value={selectedRegion.name}
            onValueChange={(name) => {
              const r = regions.find(r => r.name === name)
              setSelectedRegion({ code: r.code, name: r.name })
              setSelectedProvince({ code: "", name: "" })
              setSelectedMunicipality({ code: "", name: "" })
              setSelectedBarangay({ code: "", name: "" })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(r => (
                <SelectItem key={r.code} value={r.name}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Province</Label>
          <Select
            value={selectedProvince.name}
            disabled={!provinces.length}
            onValueChange={(name) => {
              const p = provinces.find(p => p.name === name)
              setSelectedProvince({ code: p.code, name: p.name })
              setSelectedMunicipality({ code: "", name: "" })
              setSelectedBarangay({ code: "", name: "" })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map(p => (
                <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Municipality / City</Label>
          <Select
            value={selectedMunicipality.name}
            disabled={!municipalities.length}
            onValueChange={(name) => {
              const m = municipalities.find(m => m.name === name)
              setSelectedMunicipality({ code: m.code, name: m.name })
              setSelectedBarangay({ code: "", name: "" })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select municipality" />
            </SelectTrigger>
            <SelectContent>
              {municipalities.map(m => (
                <SelectItem key={m.code} value={m.name}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Barangay</Label>
          <Select
            value={selectedBarangay.name}
            disabled={!barangays.length}
            onValueChange={(name) => {
              const b = barangays.find(b => b.name === name)
              setSelectedBarangay({ code: b.code, name: b.name })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select barangay" />
            </SelectTrigger>
            <SelectContent>
              {barangays.map(b => (
                <SelectItem key={b.code} value={b.name}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label>Subdivision</Label>
          <Input value={subdivision} onChange={(e) => setSubdivision(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Street</Label>
          <Input value={street} onChange={(e) => setStreet(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>House No.</Label>
          <Input value={houseNo} onChange={(e) => setHouseNo(e.target.value)} />
        </div>
      </div>
    </div>
  )
}

export default AddressForm

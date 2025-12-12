import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import React, { useMemo } from 'react'

const SearchFilter = ({ 
  onSearchChange, 
  onDepartmentChange, 
  onDistrictChange, 
  onPositionChange, 
  searchValue, 
  department, 
  district, 
  position, 
  employees = [] 
}) => {

  // Extract unique values from employee data
  const filterOptions = useMemo(() => {
    // Extract departments (you may need to adjust property names based on your API response)
    const departments = [...new Set(employees
      .map(emp => emp.department || emp.department_name)
      .filter(Boolean)
    )].sort()

    // Extract districts
    const districts = [...new Set(employees
      .map(emp => emp.district || emp.district_name)
      .filter(Boolean)
    )].sort()

    // Extract positions
    const positions = [...new Set(employees
      .map(emp => emp.position_name || emp.position)
      .filter(Boolean)
    )].sort()
    
    return { departments, districts, positions }
  }, [employees])

  return (
    <div>
        <Card>
            <CardContent>
                <div className='grid grid-cols-2 md:flex gap-5'>
                <div className='flex-1'>
                    <div className='relative'>
                    <Search className='absolute left-3 top-3 h-4 w-4'/>
                    <Input 
                     type="text"
                      className="pl-10"
                      placeholder="Search employees..."
                      value={searchValue}
                      onChange={(e) => onSearchChange(e.target.value)}
                    />
                    </div>
                </div>
                
                <Select value={department} onValueChange={onDepartmentChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Department"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Departments</SelectLabel>
                            <SelectItem value="all">All Departments</SelectItem>
                            {filterOptions.departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={district} onValueChange={onDistrictChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="District"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>District</SelectLabel>
                            <SelectItem value="all">All Districts</SelectItem>
                            {filterOptions.districts.map((dist) => (
                              <SelectItem key={dist} value={dist}>
                                {dist}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={position} onValueChange={onPositionChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Position"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Position</SelectLabel>
                            <SelectItem value="all">All Positions</SelectItem>
                            {filterOptions.positions.map((pos) => (
                              <SelectItem key={pos} value={pos}>
                                {pos}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default SearchFilter
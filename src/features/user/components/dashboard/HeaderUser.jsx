import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from 'lucide-react'
import React from 'react'

const HeaderUser = () => {
  return (
    <div><Card className="shadow-lg border-0 bg-gradient-to-r from-[#7CB342]/10 to-[#2D5A2D]/10">
        <CardContent className="p-4 md:px-6 md:py-2">
          <div className="flex sm:flex-row items-start sm:items-center gap-3 md:gap-4">
            
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-semibold text-[#1A3A1A]">Welcome back, Kiko</h2>
              <p className="text-sm md:text-base text-muted-foreground">IT Officer • ICT Unit</p>
            </div>

            <Avatar className="h-12 w-12 md:h-16 md:w-16">
              <AvatarFallback className="bg-[#7CB342] text-[#1A3A1A] text-base md:text-lg">SC</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card></div>
  )
} 

export default HeaderUser
import { createContext, useContext, useState } from "react"

const mockIncidents = [
  {
    id: "inc_1",
    referenceId: "INC-2025-001",
    title: "Broken Emergency Exit Light",
    description:
      "The emergency exit light in Building C, 3rd floor near room 305 has been flickering and went out completely yesterday evening.",
    category: "facilities",
    status: "in_review",
    location: "Building C, 3rd Floor",
    dateReported: new Date("2025-01-08"),
    dateOccurred: new Date("2025-01-07"),
    isAnonymous: false,
    reporterId: "usr_student1",
    reporterName: "Alex Johnson",
  },
  {
    id: "inc_2",
    referenceId: "INC-2025-002",
    title: "Suspicious Activity Near Parking Lot",
    description:
      "Noticed an unfamiliar individual taking photos of vehicles in the faculty parking lot around 6 PM. They left when approached by security.",
    category: "safety",
    status: "resolved",
    location: "Faculty Parking Lot B",
    dateReported: new Date("2025-01-07"),
    dateOccurred: new Date("2025-01-07"),
    isAnonymous: true,
    reporterId: "usr_anon",
    adminNotes:
      "Security has reviewed CCTV footage. Individual was identified as a delivery driver. No further action needed.",
  },
  {
    id: "inc_3",
    referenceId: "INC-2025-003",
    title: "Verbal Harassment in Library",
    description:
      "A group of students were using offensive language and making inappropriate comments towards others in the quiet study area.",
    category: "harassment",
    status: "pending",
    location: "Main Library, 2nd Floor",
    dateReported: new Date("2025-01-09"),
    dateOccurred: new Date("2025-01-09"),
    isAnonymous: true,
    reporterId: "usr_anon2",
  },
  {
    id: "inc_4",
    referenceId: "INC-2025-004",
    title: "Missing Lab Equipment",
    description:
      "Two microscopes and a set of lab tools went missing from Chemistry Lab 201 sometime during the weekend.",
    category: "theft",
    status: "in_review",
    location: "Science Building, Lab 201",
    dateReported: new Date("2025-01-06"),
    dateOccurred: new Date("2025-01-05"),
    isAnonymous: false,
    reporterId: "usr_staff1",
    reporterName: "Dr. Maria Chen",
    assignedTo: "Security Team",
  },
  {
    id: "inc_5",
    referenceId: "INC-2025-005",
    title: "Water Leak in Dormitory",
    description:
      "There's a persistent water leak from the ceiling in room 412 of North Dormitory. Water is dripping onto electrical outlets.",
    category: "facilities",
    status: "pending",
    location: "North Dormitory, Room 412",
    dateReported: new Date("2025-01-09"),
    dateOccurred: new Date("2025-01-09"),
    isAnonymous: false,
    reporterId: "usr_student2",
    reporterName: "Jamie Rivera",
  },
]

const IncidentsContext = createContext(undefined)

export function IncidentsProvider({ children }) {
  const [incidents, setIncidents] = useState(mockIncidents)

  const addIncident = (incident) => {
    const id = "inc_" + Math.random().toString(36).substr(2, 9)
    const referenceId = `INC-2025-${String(incidents.length + 1).padStart(3, "0")}`

    const newIncident = {
      ...incident,
      id,
      referenceId,
      status: "pending",
      dateReported: new Date(),
    }

    setIncidents((prev) => [newIncident, ...prev])
    return referenceId
  }

  const updateIncidentStatus = (id, status, notes) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              status,
              adminNotes: notes
                ? inc.adminNotes
                  ? inc.adminNotes + "\n" + notes
                  : notes
                : inc.adminNotes,
            }
          : inc
      )
    )
  }

  const getIncidentById = (id) => incidents.find((inc) => inc.id === id)

  const getUserIncidents = (userId) =>
    incidents.filter((inc) => inc.reporterId === userId)

  return (
    <IncidentsContext.Provider
      value={{
        incidents,
        addIncident,
        updateIncidentStatus,
        getIncidentById,
        getUserIncidents,
      }}
    >
      {children}
    </IncidentsContext.Provider>
  )
}

export function useIncidents() {
  const context = useContext(IncidentsContext)

  if (context === undefined) {
    throw new Error("useIncidents must be used within an IncidentsProvider")
  }

  return context
}

export const IncidentStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
}

export const IncidentCategory = {
  HARASSMENT: "HARASSMENT",
  BULLYING: "BULLYING",
  SAFETY: "SAFETY",
  DISCRIMINATION: "DISCRIMINATION",
  OTHER: "OTHER",
}

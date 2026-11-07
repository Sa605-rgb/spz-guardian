/** Patient Care — Task Management (by category) */
export const patientCareSections = [
  {
    id: 'personal',
    letter: 'A',
    title: 'Personal Care',
    icon: 'User',
    rows: [
      { location: 'Bay A SPZ001', task: 'Full Bed Bath', allocated: '08:00', completed: '08:30', status: 'on_time' },
      { location: 'Bay A SPZ001', task: 'Partial Wash', allocated: '09:30', completed: '09:40', status: 'on_time' },
      { location: 'Bay B SPZ007', task: 'Face & Hand Care', allocated: '10:00', completed: '10:05', status: 'on_time' },
      { location: 'Bay B SPZ007', task: 'Oral Care', allocated: '09:00', completed: '09:45', status: 'late' },
      { location: 'Bay B SPZ007', task: 'Continence Care', allocated: '11:00', completed: '11:40', status: 'late' },
      { location: 'Bay A SPZ001', task: 'Dressing & Grooming', allocated: '12:30', completed: '12:45', status: 'missed' },
    ],
  },
  {
    id: 'mobility',
    letter: 'B',
    title: 'Patient Mobility',
    icon: 'Footprints',
    rows: [
      { location: 'Bay C SPZ013', task: 'Mobility Support', allocated: '10:00', completed: '10:30', status: 'on_time' },
      { location: 'Bay A SPZ002', task: 'Bed & Chair Mobility', allocated: '11:00', completed: '11:10', status: 'on_time' },
      { location: 'Bay D SPZ019', task: 'Turning, Sitting', allocated: '11:30', completed: '12:00', status: 'late' },
      { location: 'Bay B SPZ008', task: 'Independent Mobility', allocated: '13:00', completed: '13:05', status: 'on_time' },
    ],
  },
  {
    id: 'reposition',
    letter: 'C',
    title: 'Repositioning',
    icon: 'RefreshCw',
    rows: [
      { location: 'Bay D SPZ019', task: 'Pressure Area Care', allocated: '11:00', completed: '11:20', status: 'late' },
      { location: 'Bay B SPZ008', task: 'Patient Turning', allocated: '12:00', completed: '12:05', status: 'on_time' },
      { location: 'Bay A SPZ003', task: 'Scheduled Repositioning', allocated: '14:00', completed: '—', status: 'missed' },
      { location: 'Bay C SPZ014', task: 'Transfer to Chair', allocated: '15:00', completed: '15:10', status: 'on_time' },
    ],
  },
  {
    id: 'bed',
    letter: 'D',
    title: 'Bed & Environment Management',
    icon: 'BedDouble',
    rows: [
      { location: 'Bay A SPZ001', task: 'Linen Change', allocated: '07:00', completed: '07:15', status: 'on_time' },
      { location: 'Bay D SPZ020', task: 'Waste Disposal', allocated: '08:30', completed: '—', status: 'missed' },
      { location: 'Bay B SPZ007', task: 'Bed Space Preparation', allocated: '07:30', completed: '07:40', status: 'on_time' },
      { location: 'Bay C SPZ013', task: 'Deep Clean', allocated: '16:00', completed: '16:35', status: 'late' },
    ],
  },
  {
    id: 'clinical',
    letter: 'E',
    title: 'Clinical Care Activities',
    icon: 'Stethoscope',
    rows: [
      { location: 'Bay B SPZ007', task: 'Wound Dressing', allocated: '09:30', completed: '09:45', status: 'on_time' },
      { location: 'Bay C SPZ014', task: 'Medication', allocated: '10:15', completed: '10:40', status: 'late' },
      { location: 'Bay A SPZ001', task: 'Blood Sampling', allocated: '08:45', completed: '08:50', status: 'on_time' },
      { location: 'Bay D SPZ019', task: 'Observation', allocated: '13:30', completed: '—', status: 'missed' },
    ],
  },
  {
    id: 'nutrition',
    letter: 'F',
    title: 'Nutrition & Hydration',
    icon: 'UtensilsCrossed',
    rows: [
      { location: 'Bay C SPZ013', task: 'Meal Support', allocated: '12:00', completed: '12:30', status: 'on_time' },
      { location: 'Bay A SPZ003', task: 'Drink Provided', allocated: '13:00', completed: '13:05', status: 'on_time' },
      { location: 'Bay B SPZ007', task: 'Feeding Assistance', allocated: '12:15', completed: '12:50', status: 'late' },
      { location: 'Bay D SPZ020', task: 'Tray Removal', allocated: '13:30', completed: '13:35', status: 'on_time' },
    ],
  },
]

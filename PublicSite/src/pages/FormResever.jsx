import { useState } from 'react'
import Forms1 from './Forms1'
import Forms2 from './Forms2'
import Forms3 from './Forms3'
export default function FormResever () {
  const [step, setStep] = useState(1)

  const [reservation, setReservation] = useState({
    dateReservation: '',
    heureReservation: '13:00',
    nombrePersonnes: 2,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    message: ''
  })

  return (
    <>
      {step === 1 && (
        <Forms1
          reservation={reservation}
          setReservation={setReservation}
          setStep={setStep}
        />
      )}

      {step === 2 && (
        <Forms2
          reservation={reservation}
          setReservation={setReservation}
          setStep={setStep}
        />
      )}

      {step === 3 && (
        <Forms3
          reservation={reservation}
          setReservation={setReservation}
          setStep={setStep}
        />
      )}
    </>
  )
}

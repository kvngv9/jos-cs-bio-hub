import QRCode from 'qrcode'

export interface StudentInfo {
  name: string
  studentId: string
  level: string
  email: string
  phone?: string
  cgpa?: number
  skills?: string[]
}

export const generateStudentQR = async (student: StudentInfo): Promise<string> => {
  const studentData = {
    name: student.name,
    id: student.studentId,
    level: student.level,
    email: student.email,
    phone: student.phone,
    cgpa: student.cgpa,
    skills: student.skills?.join(', '),
    department: "Computer Science",
    institution: "University of Jos"
  }

  const qrData = JSON.stringify(studentData)
  
  try {
    const qrCodeUrl = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrCodeUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

export const generateVCardQR = async (student: StudentInfo): Promise<string> => {
  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${student.name}
ORG:University of Jos;Computer Science Department
TITLE:Student - Level ${student.level}
EMAIL:${student.email}
${student.phone ? `TEL:${student.phone}` : ''}
NOTE:Student ID: ${student.studentId}${student.cgpa ? `, CGPA: ${student.cgpa}` : ''}${student.skills?.length ? `, Skills: ${student.skills.join(', ')}` : ''}
END:VCARD`

  try {
    const qrCodeUrl = await QRCode.toDataURL(vCard, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrCodeUrl
  } catch (error) {
    console.error('Error generating vCard QR code:', error)
    throw error
  }
}
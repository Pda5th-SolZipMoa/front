'use client'

import { useState } from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import ScheduleButton from './ScheduleButton'
import DetailBox from './DetailBox'
import DetailCategory from './DetailCategory'
import mainImage from './image.png'
export default function PropertyDetail() {
  const [selectedImage, setSelectedImage] = useState(mainImage)
  const thumbnails = Array(4).fill('/placeholder.svg?height=100&width=150')

  return (
    <Container className="py-4">
      <ScheduleButton />

      <Row>
        {/* Left Column - Images */}
        <Col md={7}>
          <div className="position-relative mb-3">
            <Image
              src={selectedImage}
              alt="Main property view"
              className="w-100 rounded"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>
          <Row className="g-2">
            {thumbnails.map((thumb, idx) => (
              <Col key={idx} xs={3}>
                <Image
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-100 rounded cursor-pointer"
                  style={{ height: '80px', objectFit: 'cover' }}
                  onClick={() => setSelectedImage(thumb)}
                />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Right Column - Details */}
        <Col md={5}>
          <DetailBox />
        </Col>
      </Row>

      <DetailCategory />
    </Container>
  )
}
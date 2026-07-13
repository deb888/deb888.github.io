import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Particles({ count = 800 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!)
  const mouse = useRef({ x: 0, y: 0 })

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      const t = Math.random()
      col[i * 3] = t < 0.33 ? 0 : t < 0.66 ? 1 : 0.5
      col[i * 3 + 1] = t < 0.33 ? 1 : t < 0.66 ? 0 : 0.75
      col[i * 3 + 2] = t < 0.33 ? 0.9 : t < 0.66 ? 0.43 : 1
    }
    return [pos, col]
  }, [count])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useFrame((_, delta) => {
    mesh.current.rotation.x += delta * 0.03
    mesh.current.rotation.y += delta * 0.05
    mesh.current.position.x += (mouse.current.x * 0.5 - mesh.current.position.x) * 0.02
    mesh.current.position.y += (mouse.current.y * 0.3 - mesh.current.position.y) * 0.02
  })

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [positions, colors])

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial size={0.04} vertexColors sizeAttenuation depthWrite={false} transparent opacity={0.8} />
    </points>
  )
}

function Connections({ count = 300 }: { count?: number }) {
  const lineRef = useRef<THREE.LineSegments>(null!)
  const points = useMemo(() => {
    const p: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      p.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ))
    }
    return p
  }, [count])

  const linePositions = useMemo(() => {
    const pos: number[] = []
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < 2.5) {
          pos.push(points[i].x, points[i].y, points[i].z)
          pos.push(points[j].x, points[j].y, points[j].z)
        }
      }
    }
    return new Float32Array(pos)
  }, [points])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    return g
  }, [linePositions])

  useFrame((_, delta) => {
    lineRef.current.rotation.x += delta * 0.02
    lineRef.current.rotation.y += delta * 0.04
  })

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#00FFE7" transparent opacity={0.08} />
    </lineSegments>
  )
}

function FloatingShape() {
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh>
        <icosahedronGeometry args={[0.8, 0]} />
        <MeshDistortMaterial
          color="#FF006E"
          emissive="#FF006E"
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
          wireframe
          distort={0.2}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

function FloatingTorus() {
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 16, 60]} />
        <meshBasicMaterial color="#00FFE7" transparent opacity={0.15} />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <Particles count={800} />
      <Connections count={300} />
      <FloatingShape />
      <FloatingTorus />
    </>
  )
}

export default function HeroScene() {
  return (
    <div className="hero-scene">
      <Canvas camera={{ position: [0, 1, 10], fov: 60 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  )
}

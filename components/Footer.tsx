export default function Footer() {
  return (
    <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[#e7e7e9] text-[13px] text-[#6b6f80]" style={{ padding: '32px clamp(16px,4.6vw,72px)' }}>
      <span>© {new Date().getFullYear()} Yuvaraj</span>
      <div className="flex flex-wrap gap-5">
        <a href="tel:+919884863865" className="!text-[#6b6f80] hover:!text-[#ff0303]">+91 9884 863 865</a>
        <a href="mailto:syuvaraj12@gmail.com" className="!text-[#6b6f80] hover:!text-[#ff0303]">syuvaraj12@gmail.com</a>
        <a href="https://iamyuvi.com" className="!text-[#6b6f80] hover:!text-[#ff0303]">iamyuvi.com</a>
      </div>
    </footer>
  )
}

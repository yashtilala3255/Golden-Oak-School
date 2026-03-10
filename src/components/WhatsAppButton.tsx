
export default function WhatsAppButton() {
    const phone = '917777053054'
    const msg = encodeURIComponent('Hello! I would like to know more about Golden Oak School admissions.')
    const href = `https://wa.me/${phone}?text=${msg}`

    return (
        <>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-fab"
                aria-label="Chat on WhatsApp"
            >
                {/* Official WhatsApp Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="white">
                    <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.738 5.47 2.027 7.773L0 32l8.469-2.004A15.93 15.93 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.854l-.486-.29-5.03 1.19 1.21-4.9-.317-.503A13.27 13.27 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.928c-.398-.2-2.355-1.162-2.72-1.295-.366-.133-.633-.2-.9.2-.267.398-1.032 1.295-1.265 1.561-.233.267-.466.3-.864.1-.398-.2-1.68-.619-3.2-1.974-1.182-1.055-1.98-2.357-2.213-2.755-.233-.399-.025-.614.175-.813.18-.18.398-.466.598-.699.199-.232.265-.398.398-.665.133-.266.067-.499-.033-.699-.1-.2-.9-2.17-1.232-2.97-.325-.78-.655-.674-.9-.686l-.766-.013c-.266 0-.699.1-1.065.499-.366.398-1.398 1.366-1.398 3.33 0 1.964 1.432 3.862 1.631 4.129.2.267 2.82 4.305 6.832 6.035.955.412 1.7.658 2.28.843.958.305 1.831.262 2.52.159.769-.115 2.355-.963 2.688-1.893.333-.93.333-1.727.233-1.893-.1-.167-.366-.267-.765-.466z"/>
                </svg>
            </a>
            <style>{`
        .whatsapp-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 800;
          background: #25D366;
          color: white;
          border-radius: var(--radius-full);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(37,211,102,0.4);
          font-weight: 600;
          font-size: 0.9375rem;
          text-decoration: none;
          transition: all var(--transition);
          animation: pulse-wa 2.5s infinite;
        }
        @keyframes pulse-wa {
          0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4); }
          50% { box-shadow: 0 4px 32px rgba(37,211,102,0.7); }
        }
        .whatsapp-fab:hover {
          transform: scale(1.06) translateY(-2px);
          background: #20C55A;
        }
        .whatsapp-label {
          white-space: nowrap;
        }
        @media (max-width: 480px) {
          .whatsapp-fab { padding: 14px; }
          .whatsapp-label { display: none; }
        }
      `}</style>
        </>
    )
}

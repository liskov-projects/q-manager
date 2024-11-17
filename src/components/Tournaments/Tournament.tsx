import Image from "next/image";

// FIXME: types
export default function Tournament({num}: {num: number}) {
  return (
    <div>
      <h1>This is tournament #{num}</h1>
      <Image
        //   FIXME:
        src="/path-to-your-image.jpg" // Replace with your image path
        alt={`Tournament ${num} Image`} // A meaningful alt text for accessibility
        width={500} // Set the width of the image
        height={300} // Set the height of the image
      />
      <span>tournament description</span>
    </div>
  );
}

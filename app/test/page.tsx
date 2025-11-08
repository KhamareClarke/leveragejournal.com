export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">CSS Test Page</h1>
      <div className="bg-blue-500 p-4 rounded-lg">
        <p className="text-xl">If you can see this with colors and styling, Tailwind CSS is working!</p>
      </div>
      <div className="mt-4 bg-green-500 p-4 rounded-lg">
        <p>Red background = Tailwind working</p>
        <p>Blue box = Tailwind working</p>
        <p>Green box = Tailwind working</p>
      </div>
    </div>
  );
}

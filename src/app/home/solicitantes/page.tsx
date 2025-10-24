import Navbar from "@/components/Navbar";
import Title from "@/components/Title"
import VistaPersonalSupervisor from "../../../components/supervisor/VistaPersonalSupervisor"

async function Solicitantes () {
  return (
    <>
      <Navbar />
      <Title text={"Personal"} />
      
      <div className="container mx-auto px-4 py-8">
        <VistaPersonalSupervisor />
      </div>
    </>
  );
}

export default Solicitantes;
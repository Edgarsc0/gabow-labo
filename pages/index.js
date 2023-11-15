import dynamic from "next/dynamic";
import { Box, Card, Grid, Heading, Text, Flex, Avatar, Button, TextField, DropdownMenu, Theme, Badge, AlertDialog, Callout } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { positionVector } from "@/lib/functions/cords";
import 'react-toastify/dist/ReactToastify.css';
import { InfoCircledIcon } from "@radix-ui/react-icons"

const MapWithClickEvent = dynamic(() => import("@/components/Map"), { ssr: false });

const Main = () => {
  const [waitingForPoint, setWaitingForPoint] = useState(false);
  const [markerList, setNewMarker] = useState([]);
  const [openAddPointDialog, setOpenAddPointDialog] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [id, setId] = useState(0);
  const [charactersUsed, setNewCharacter] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [openDeletePointsDialog, setOpenDeletePointsDialog] = useState(false);

  useEffect(() => {
    setNewCharacter([...charactersUsed, String.fromCharCode(65 + id)]);
  }, [id])

  useEffect(() => {
    console.log(markerList);
  }, [markerList])

  const stopSetPoints = (newMarker) => {
    setNewMarker([newMarker, ...markerList]);
    setWaitingForPoint(false);
  };
  const handleSetPoint = () => {
    toast.success(`Selecciona una ubicación en el mapa`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setWaitingForPoint(true);
  };
  const handleAddPointWithCords = () => {
    setOpenAddPointDialog(true)
  };
  const closeDialog = () => {
    setOpenAddPointDialog(false);
  };
  const addPoint = (e) => {
    e.preventDefault();
    const [lat, lng] = e.target.newCords.value.split(",").map(item => JSON.parse(item));
    setNewMarker([{
      position: [lat, lng],
      character: String.fromCharCode(65 + id)
    }, ...markerList]);
    setSelectedMarker({ lat, lng })
    setId(id + 1);
    closeDialog();
    if (mapRef) {
      mapRef.flyTo([lat, lng], 18, {
        duration: 1.5
      });
    }
  };
  const moveElementToStart = element => {
    if (markerList.includes(element)) {
      const arrayWithoutElement = markerList.filter(item => item !== element);
      return [element, ...arrayWithoutElement];
    }
  };
  const handleMarkerClick = (pointCords) => {
    const point = markerList.find(item => item.position[0] == pointCords.lat && item.position[1] == pointCords.lng);
    setNewMarker(moveElementToStart(point));
  };
  const handleDeleteMarkerList = () => {
    setOpenDeletePointsDialog(true);
  };
  const closeDeleteMarkerListDialog = () => {
    setOpenDeletePointsDialog(false);
  };
  const deleteMarkerList = () => {
    setNewMarker([]);
    closeDeleteMarkerListDialog();
  }
  const succcessCopy = () => {
    toast.success(`¡Coordenadas copiadas al portapapeles!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <AlertDialog.Root open={openDeletePointsDialog}>
        <AlertDialog.Content size="4">
          <AlertDialog.Title>Eliminar puntos</AlertDialog.Title>
          <AlertDialog.Description size="4">
            ¿Estas seguro de que quieres eliminar todos los puntos?
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button onClick={closeDeleteMarkerListDialog} variant="soft" color="gray">
                Cancelar
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="blue" onClick={deleteMarkerList}>
                Eliminar todo
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={openAddPointDialog}>
        <AlertDialog.Content size="4">
          <form onSubmit={addPoint}>
            <AlertDialog.Title>Agregar nuevo punto a partir de coordenadas</AlertDialog.Title>
            <AlertDialog.Description size="4">
              <Callout.Root>
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                  Escribe unas coordenadas validas: <strong>( latitud , longitud)</strong>;
                </Callout.Text>
              </Callout.Root>
              <div className="py-3">
                <TextField.Input size="3" name="newCords" placeholder="Escribe las coordenadas del punto" className="text-center" />
              </div>
            </AlertDialog.Description>
            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button onClick={closeDialog} variant="soft" color="gray">
                  Cancelar
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button variant="solid" color="blue" type="submit">
                  Agregar punto
                </Button>
              </AlertDialog.Action>
            </Flex>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <div className="flex">
        <div style={{ width: "50vh" }}>
          <div className="text-center">
            <Heading size="9" className="pt-6 gradient-text">Gabow</Heading>
          </div>
          <div>
            <Grid columns="2" mx="2" my="5">
              <Card className="hover:cursor-pointer hover:opacity-80 m-2" onClick={handleSetPoint}>
                <Flex align="center">
                  <Avatar
                    fallback={
                      <Box width="5" height="5">
                        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1C0.447715 1 0 1.44772 0 2V13C0 13.5523 0.447715 14 1 14H14C14.5523 14 15 13.5523 15 13V2C15 1.44772 14.5523 1 14 1H1ZM7.5 10.625C9.22589 10.625 10.625 9.22589 10.625 7.5C10.625 5.77411 9.22589 4.375 7.5 4.375C5.77411 4.375 4.375 5.77411 4.375 7.5C4.375 9.22589 5.77411 10.625 7.5 10.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                      </Box>
                    } />
                  <Text ml="3">
                    Agregar punto en el mapa
                  </Text>
                </Flex>
              </Card>
              <Card className="hover:cursor-pointer hover:opacity-80 m-2" onClick={handleAddPointWithCords}>
                <Flex align="center">
                  <Avatar
                    fallback={
                      <Box width="5" height="5">
                        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1C0.447715 1 0 1.44772 0 2V13C0 13.5523 0.447715 14 1 14H14C14.5523 14 15 13.5523 15 13V2C15 1.44772 14.5523 1 14 1H1ZM7.5 10.625C9.22589 10.625 10.625 9.22589 10.625 7.5C10.625 5.77411 9.22589 4.375 7.5 4.375C5.77411 4.375 4.375 5.77411 4.375 7.5C4.375 9.22589 5.77411 10.625 7.5 10.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                      </Box>
                    } />
                  <Text ml="3">
                    Punto a partir de coordenadas
                  </Text>
                </Flex>
              </Card>
              <Card className="hover:cursor-pointer hover:opacity-80 m-2" onClick={handleSetPoint}>
                <Flex align="center">
                  <Avatar
                    fallback={
                      <Box width="5" height="5">
                        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1C0.447715 1 0 1.44772 0 2V13C0 13.5523 0.447715 14 1 14H14C14.5523 14 15 13.5523 15 13V2C15 1.44772 14.5523 1 14 1H1ZM7.5 10.625C9.22589 10.625 10.625 9.22589 10.625 7.5C10.625 5.77411 9.22589 4.375 7.5 4.375C5.77411 4.375 4.375 5.77411 4.375 7.5C4.375 9.22589 5.77411 10.625 7.5 10.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                      </Box>
                    } />
                  <Text ml="3">
                    Calcular distancia entre dos puntos
                  </Text>
                </Flex>
              </Card>
              <Card className="hover:cursor-pointer hover:opacity-80 m-2" onClick={handleDeleteMarkerList}>
                <Flex align="center">
                  <Avatar
                    fallback={
                      <Box width="5" height="5">
                        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1C0.447715 1 0 1.44772 0 2V13C0 13.5523 0.447715 14 1 14H14C14.5523 14 15 13.5523 15 13V2C15 1.44772 14.5523 1 14 1H1ZM7.5 10.625C9.22589 10.625 10.625 9.22589 10.625 7.5C10.625 5.77411 9.22589 4.375 7.5 4.375C5.77411 4.375 4.375 5.77411 4.375 7.5C4.375 9.22589 5.77411 10.625 7.5 10.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                      </Box>
                    } />
                  <Text ml="3">
                    Borrar todo
                  </Text>
                </Flex>
              </Card>
            </Grid>
          </div>
          <div className="overflow-y-scroll px-5" style={{ height: "68vh" }}>
            <Grid columns="1" mx="4" gapY="5">
              {markerList.map((marker, id) => (
                <div className={selectedMarker ? (selectedMarker.lat == marker.position[0] && selectedMarker.lng == marker.position[1] ?
                  "border border-blue-500  shadow-lg" : null) : null}>
                  <Card key={id}>
                    <Flex justify="between">
                      <Badge color="orange">
                        {`Punto ${marker.character} (${marker.position[0].toFixed(3)},${marker.position[1].toFixed(3)})`}
                      </Badge>
                      <Theme>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button variant="soft">
                              Opciones
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item shortcut="⌘ E">Editar punto</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item>Copiar Coordenadas</DropdownMenu.Item>
                            <DropdownMenu.Item>Cambiar de color</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item shortcut="Win + ⌫" color="red">
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Theme>
                    </Flex>
                    <div className="flex flex-row items-center mt-2" >
                      <div className="basis-1/7 text-center">
                        <Heading>
                          {marker.character + "="}
                        </Heading>
                      </div>
                      <div className="basis-6/7">
                        <TextField.Input size="3" value={`${positionVector(marker.position[0], marker.position[1])[0]}`} className="disabled text-center border-none focus:outline-none" />
                        <TextField.Input size="3" value={`${positionVector(marker.position[0], marker.position[1])[1]}`} className="disabled text-center" />
                        <TextField.Input size="3" value={`${positionVector(marker.position[0], marker.position[1])[2]}`} className="disabled text-center" />
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </Grid>
          </div>
        </div>
        <MapWithClickEvent
          waitingForPoint={waitingForPoint}
          onStop={stopSetPoints}
          onMapRef={(ref) => setMapRef(ref)}
          currentMarkers={markerList}
          onMarkerClick={handleMarkerClick}
          id={id}
          setId={setId}
          setSelectedMarker={setSelectedMarker}
          onCopy={succcessCopy}
        />
      </div>
    </>
  );

}

export default Main;
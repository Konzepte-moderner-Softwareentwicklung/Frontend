import { useEffect, useState } from "react";
import {
    createNewOffer,
    getLocationName,
    getOffer,
    type Offer,
    type SearchDialogFields,
    setLocationName,
} from "@/pages/drives/drivesService.tsx";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { OfferDetailCard } from "@/components/drives/search/OfferDetailCard";
import { EditOfferDialog } from "@/components/drives/search/EditOfferDialog";
import { DriverApplicationDialog } from "@/components/drives/search/DriverApplicationDialog";
import { ErrorDisplay } from "@/components/drives/search/ErrorDisplay";

function DrivesSearchDetailPage() {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDriverDialog, setShowDriverDialog] = useState(false);
    const [description, setDescription] = useState("");
    const [info, setInfo] = useState("");
    const [infoCar, setInfoCar] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [storageHeight, setStorageHeight] = useState<number | null>(null);
    const [seats, setSeats] = useState("");
    const [endDate, setEndDate] = useState(new Date());
    const [restrictions, setRestrictions] = useState("");
    const [isEmail, setIsEmail] = useState<boolean>(false);
    const [isChat, setIsChat] = useState(false);
    const [isPhone, setIsPhone] = useState<boolean>(false);

    const [storageDepth, setStorageDepth] = useState<number | null>(null);
    const [storageWeight, setStorageWeight] = useState<number | null>(null);

    const [offer, setOffer] = useState<Offer | undefined>(undefined);
    const { id } = useParams();
    const [storageWidth, setStorageWidth] = useState<number | null>(null);
    const navigate = useNavigate();
    const userId =
        localStorage.getItem("UserId") ||
        sessionStorage.getItem("UserId") ||
        "";
    
    const handleBack = () => {
        navigate("/drives");
    };
    
    const [fields, setFields] = useState<SearchDialogFields>({
        title: "",
        creatorId: "",
        description: "",
        locationFrom: "",
        locationTo: "",
        passengers: 0,
        price: 0,
        package: {
            weight: 0,
            size: {
                width: 0,
                height: 0,
                depth: 0,
            },
        },
        info: [],
        restrictions: [],
    });

    useEffect(() => {
        async function loadOffer() {
            if (id) {
                const fetchedOffer = await getOffer(id);

                if (!fetchedOffer) {
                    console.error("Offer not found for id:", id);
                    return;
                }

                console.log("Fetched offer:", fetchedOffer);
                setOffer(fetchedOffer);

                const locationFromName = await getLocationName(
                    fetchedOffer.locationFrom.latitude,
                    fetchedOffer.locationFrom.longitude
                );
                const locationToName = await getLocationName(
                    fetchedOffer.locationTo.latitude,
                    fetchedOffer.locationTo.longitude
                );

                setFields({
                    title: fetchedOffer.title || "",
                    creatorId: fetchedOffer.creator || "",
                    description: fetchedOffer.description || "",
                    locationFrom: locationFromName || "",
                    locationTo: locationToName || "",
                    passengers: fetchedOffer?.occupiedSpace?.[0]?.seats || 0,
                    price: fetchedOffer.price || 0,
                    package:
                        fetchedOffer?.occupiedSpace?.[0]?.items?.[0] || {
                            weight: 0,
                            size: { width: 0, height: 0, depth: 0 },
                        },
                    info: fetchedOffer.info || [],
                    restrictions: fetchedOffer.restrictions || [],
                });
            }
        }

        loadOffer();
    }, [id]);

    const handleFieldChange = (field: keyof SearchDialogFields, value: any) => {
        setFields((prev) => ({ ...prev, [field]: value }));
    };

    const handlePackageChange = (field: string, value: number) => {
        setFields((prev) => ({
            ...prev,
            package: {
                ...prev.package,
                ...(field === "weight" 
                    ? { weight: value }
                    : {
                        size: {
                            ...prev.package.size,
                            [field]: value,
                        },
                    }
                ),
            },
        }));
    };

    async function handleDriverSubmit() {
        const locationFrom = await setLocationName(fields.locationFrom);
        const locationTo = await setLocationName(fields.locationTo)
        const newOffer: Offer = {
            id: "0",
            title: fields.title,
            creator: sessionStorage.getItem("UserID") || "",
            paidSpaces: [],
            description: description,
            price: fields.price,
            locationFrom: locationFrom || {latitude: 0, longitude: 0},
            locationTo: locationTo || {latitude: 0, longitude: 0},
            driver:  "",
            startDateTime: startDate.toISOString(),
            endDateTime: endDate.toISOString(),
            canTransport: {
                occupiedBy: sessionStorage.getItem("UserID") || "",
                seats: parseInt(seats),
                items: [
                    {
                        size: {
                            width: storageWidth || 0,
                            height: storageHeight || 0,
                            depth: storageDepth || 0,
                        },
                        weight: storageWeight || 0,
                    },
                ],
            },
            occupiedSpace: [
                {
                    occupiedBy: fields?.creatorId,
                    seats: 1,
                    items: [fields.package],
                },
            ],
            isPhone: isPhone,
            isEmail: isEmail,
            isChat: isChat,
            isGesuch: false,
            restrictions: restrictions.split(";"),
            info: info.split(";"),
            infoCar: infoCar.split(";"),
            createdAt: new Date().toISOString(),
            imageURL: ""
        };

        setShowDriverDialog(false);
        try {
            createNewOffer(newOffer).then(function (addedOffer) {
                if (offer) {
                    offer.ended = true;
                }
                navigate(`/drives/${addedOffer.id}`);
            });
        } catch (error: any) {
            if (error.response?.status === 500) {
                toast("Server interner Fehler");
            } else {
                toast.error("Fahrt erstellen fehlgeschlagen");
            }
            setShowDriverDialog(false);
        }
    }

    if (!offer) {
        return <ErrorDisplay onBackClick={handleBack} />;
    }

    return (
        <>
            <OfferDetailCard
                offer={offer}
                fields={fields}
                userId={userId}
                onEditClick={() => setShowEditDialog(true)}
                onDriverApplicationClick={() => setShowDriverDialog(true)}
                onBackClick={handleBack}
            />

            <EditOfferDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                fields={fields}
                onFieldChange={handleFieldChange}
                onPackageChange={handlePackageChange}
            />

            <DriverApplicationDialog
                open={showDriverDialog}
                onOpenChange={setShowDriverDialog}
                startDate={startDate}
                endDate={endDate}
                seats={seats}
                storageWidth={storageWidth}
                storageHeight={storageHeight}
                storageDepth={storageDepth}
                storageWeight={storageWeight}
                description={description}
                info={info}
                restrictions={restrictions}
                infoCar={infoCar}
                isPhone={isPhone}
                isEmail={isEmail}
                isChat={isChat}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onSeatsChange={setSeats}
                onStorageWidthChange={setStorageWidth}
                onStorageHeightChange={setStorageHeight}
                onStorageDepthChange={setStorageDepth}
                onStorageWeightChange={setStorageWeight}
                onDescriptionChange={setDescription}
                onInfoChange={setInfo}
                onRestrictionsChange={setRestrictions}
                onInfoCarChange={setInfoCar}
                onPhoneChange={setIsPhone}
                onEmailChange={setIsEmail}
                onChatChange={setIsChat}
                onSubmit={handleDriverSubmit}
            />
        </>
    );
}

export default DrivesSearchDetailPage;

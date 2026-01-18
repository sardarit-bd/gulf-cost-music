import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import PhotographerRow from "./PhotographerRow";
import PlanChangeModal from "./PlanChangeModal";
import ViewProfileModal from "./ViewProfileModal";

export default function PhotographerTable({
    photographers,
    pagination,
    filters,
    onRefresh,
    onPageChange,
    loading,
}) {
    const [selected, setSelected] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [planTarget, setPlanTarget] = useState(null);

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4 text-left">Photographer</th>
                                <th className="p-4 text-left">Contact</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Plan</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {photographers.map((p) => (
                                <PhotographerRow
                                    key={p._id}
                                    photographer={p}
                                    onRefresh={onRefresh}
                                    onView={setSelected}
                                    onDelete={setDeleteTarget}
                                    onPlan={setPlanTarget}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ViewProfileModal
                photographer={selected}
                isOpen={!!selected}
                onClose={() => setSelected(null)}
            />

            <DeleteConfirmationModal
                photographer={deleteTarget}
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    setDeleteTarget(null);
                    onRefresh();
                }}
            />

            <PlanChangeModal
                photographer={planTarget}
                isOpen={!!planTarget}
                onClose={() => setPlanTarget(null)}
            />
        </>
    );
}

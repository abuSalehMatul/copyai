<?php

namespace Database\Seeders;

use App\Models\SampleCopy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;

class SampleCopySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (App::environment('production')) {
            return;
        }
        $formats = config("formatOptions");
        $totalSize = sizeof($formats);
        $i = 0;

        foreach ($formats as $formatKey => $format) {
            $description = $this->getDescription($formatKey);

            $this->insertIntoSampleCopy($formatKey, $description);

            $i++;
            $res = "$i from Total of $totalSize";
            $output = new \Symfony\Component\Console\Output\ConsoleOutput();
            $output->writeln(json_encode($res));
        }
    }

    public function getDescription($option)
    {
        $formats = [
            "def" => 'Aivatic is a collection of luxurious timepieces that make a bold, professional statement. Frame your wrist with one of our appealing leather or fabric straps, and cap it with a smart gold frame, delivering a balanced, sophisticated appearance to match your unique sense of style.',
            "pain" => 'Annoyed with clogged sinks and showers? Looking for a reliable drain stopper that can keep your drain free of hair? Hair Stopper is the best solution. It prevents hair from clogging the plug hole, which makes it easy to clean up hair in the shower.',
            "emotion" => 'Casts a warm glow reminiscent of candlelight. A high quality, stylish light that will fit in perfectly no matter where you choose to put it. Use it to highlight your favorite plant, or for a nightlight. Add some artful nature to your space with this beautiful bonsai tree night light.',
            "benefit" => 'Jump for joy! The perfect shoe for basketball, volleyball, handball or just plain fun. Feel the difference in energy transfer with our high-tech shock-absorbing midsole and easy lacing system. Climb to new heights of performance and comfort with a shoe that’s loaded with style for athletes who take life, and their shoes, seriously.'
        ];
        return $formats[$option];
    }

    public function insertIntoSampleCopy($format, $description)
    {
        $sampleCopy = SampleCopy::where('format', $format)
            ->first();

        if ($sampleCopy == null) {
            $sampleCopy = new SampleCopy();
        }
        $sampleCopy->format = $format;
        $sampleCopy->description = $description;
        $sampleCopy->save();
    }
}
